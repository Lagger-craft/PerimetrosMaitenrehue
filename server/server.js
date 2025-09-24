const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 5000;
const USERS_FILE = path.join(__dirname, "users.json");
const QUOTES_FILE = path.join(__dirname, "quotes.json"); // Nuevo archivo para cotizaciones
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_this_later"; // Cambia esto por una clave secreta más segura

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../build")));

// --- Funciones Auxiliares ---
const readUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, retorna un arreglo vacío
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

const readQuotes = async () => {
  try {
    const data = await fs.readFile(QUOTES_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeQuotes = async (quotes) => {
  await fs.writeFile(QUOTES_FILE, JSON.stringify(quotes, null, 2));
};

// --- Middleware de Autenticación ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No hay token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado: Se requiere rol de administrador" });
  }
};

// --- Rutas de Autenticación ---

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 peticiones por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 15 minutos",
});

// Registrar un nuevo usuario
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const role = "user"; // Forzar siempre el rol a 'user' en el registro público

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Usuario y contraseña son requeridos" });
    }

    const users = await readUsers();
    const userExists = users.find((u) => u.username === username);

    if (userExists) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya existe" });
    }

    // Validación de la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "La contraseña no es segura. Debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username,
      password: hashedPassword,
      role,
    };

    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Iniciar sesión
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Usuario y contraseña son requeridos" });
    }

    const users = await readUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// --- Rutas de Cotizaciones ---

// Enviar una nueva cotización
app.post("/api/quotes", async (req, res) => {
  try {
    const { name, rut, phone, email, fenceType, fenceHeight, message } =
      req.body;

    // Validación básica
    if (!name || !rut || !phone || !email || !fenceType || !fenceHeight) {
      return res
        .status(400)
        .json({ message: "Faltan campos obligatorios para la cotización" });
    }

    const quotes = await readQuotes();
    const newQuote = {
      id: quotes.length > 0 ? Math.max(...quotes.map((q) => q.id)) + 1 : 1,
      name,
      rut,
      phone,
      email,
      fenceType,
      fenceHeight,
      message,
      timestamp: new Date().toISOString(),
    };

    quotes.push(newQuote);
    await writeQuotes(quotes);

    res
      .status(201)
      .json({ message: "Cotización enviada exitosamente", quote: newQuote });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error en el servidor al enviar cotización" });
  }
});

// Obtener todas las cotizaciones (solo para administradores)
app.get("/api/quotes", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const quotes = await readQuotes();
    res.json(quotes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener cotizaciones" });
  }
});

// Cualquier otra ruta que no sea API, sirve el index.html del frontend
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
