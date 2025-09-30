# 🏗️ PerímetrosMaitenrehue - Sitio Web Completo

<div align="center">

![Logo PerímetrosMaitenrehue](src/assets/mi-logo.png)

**Sitio web profesional para empresa de cercos vibrados**  
*Solución completa con panel de administración y gestión de productos*

[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub%20Pages-success)](https://lagger-craft.github.io/PerimetrosMaitenrehue/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com/)

[🌐 Ver Sitio Web](https://lagger-craft.github.io/PerimetrosMaitenrehue/) | [📋 Panel Admin](https://lagger-craft.github.io/PerimetrosMaitenrehue/administracion) | [🧪 Debug WhatsApp](https://lagger-craft.github.io/PerimetrosMaitenrehue/whatsapp-test)

</div>

---

## 📋 Tabla de Contenido

- [🎯 Características Principales](#-características-principales)
- [🚀 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚡ Instalación Rápida](#-instalación-rápida)
- [🐳 Configuración con Docker](#-configuración-con-docker)
- [🔧 Configuración Detallada](#-configuración-detallada)
- [👨‍💼 Panel de Administración](#-panel-de-administración)
- [📱 Integración WhatsApp](#-integración-whatsapp)
- [🚀 Despliegue](#-despliegue)
- [🛠️ Desarrollo](#-desarrollo)
- [📱 Compatibilidad](#-compatibilidad)

---

## 🎯 Características Principales

### **Frontend (React + Vite)**
- ✅ **Responsive Design**: 100% compatible móvil/tablet/desktop
- ✅ **Panel de Administración**: Gestión completa de cotizaciones y productos
- ✅ **Integración WhatsApp**: Contacto directo sin APIs externas
- ✅ **Galería de Productos**: Visualización optimizada de cercos
- ✅ **Sistema de Cotizaciones**: Formulario completo con validación
- ✅ **Navegación Móvil**: Menú flotante para administradores
- ✅ **Animaciones Suaves**: Transiciones profesionales
- ✅ **Estados de Carga**: Feedback visual optimizado

### **Backend (Node.js + Express)**
- ✅ **API RESTful**: Endpoints completos y documentados
- ✅ **Autenticación JWT**: Sistema seguro de usuarios
- ✅ **Base de Datos MongoDB**: Almacenamiento optimizado
- ✅ **Subida de Archivos**: Gestión de imágenes de productos
- ✅ **Middleware de Seguridad**: Rate limiting y validación
- ✅ **Variables de Entorno**: Configuración flexible

---

## 🚀 Tecnologías Utilizadas

### **Frontend Stack**
```json
{
  "framework": "React 18.2.0",
  "bundler": "Vite 5.0.0",
  "ui": "React Bootstrap 2.10.0",
  "routing": "React Router 6.8.0",
  "icons": "React Bootstrap Icons",
  "styling": "CSS3 + Custom Properties"
}
```

### **Backend Stack**
```json
{
  "runtime": "Node.js 20.x",
  "framework": "Express 4.19.2",
  "database": "MongoDB 7.x",
  "auth": "JWT + bcryptjs",
  "files": "Multer",
  "security": "express-rate-limit"
}
```

---

## 📁 Estructura del Proyecto

```
PerMaitenrehue/
├── 📁 public/               # Archivos estáticos
├── 📁 src/                  # Código fuente frontend
│   ├── 📁 components/       # Componentes React
│   │   ├── 📁 admin/        # Panel de administración
│   │   ├── 📁 auth/         # Autenticación
│   │   └── 📁 layout/       # Componentes de layout
│   ├── 📁 context/          # Context API
│   ├── 📁 hooks/            # Custom hooks
│   └── main.jsx             # Punto de entrada
├── 📁 server/               # Backend Node.js
│   ├── 📁 config/           # Configuración DB
│   ├── 📁 models/           # Modelos MongoDB
│   ├── 📁 routes/           # Rutas API
│   ├── 📁 middleware/       # Middlewares
│   ├── server.js            # Servidor principal
│   └── .env                 # Variables de entorno
├── package.json             # Dependencias frontend
├── vite.config.js           # Configuración Vite
└── docker-compose.yml       # Configuración Docker
```

---

## ⚡ Instalación Rápida

### **Prerrequisitos**
- ✅ **Node.js 18+** ([Descargar](https://nodejs.org/))
- ✅ **Docker** ([Descargar](https://docker.com/))
- ✅ **Git** ([Descargar](https://git-scm.com/))

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/Lagger-craft/PerimetrosMaitenrehue.git
cd PerimetrosMaitenrehue
```

### **2. Instalación Automática**
```bash
# Instalar dependencias frontend
npm install

# Instalar dependencias backend
cd server
npm install
cd ..
```

### **3. Configurar Variables de Entorno**
```bash
# Crear archivo de configuración backend
cp server/.env.example server/.env

# Editar variables (usar tu editor preferido)
nano server/.env
```

**Contenido del archivo `server/.env`:**
```env
# Configuración del Servidor
PORT=5000
NODE_ENV=development

# Base de Datos MongoDB
MONGODB_URI=mongodb://admin:password123@localhost:27017/perimetros?authSource=admin

# Autenticación JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_2024
JWT_EXPIRE=24h

# Configuración CORS
FRONTEND_URL=http://localhost:5173
```

### **4. Iniciar con Docker (Recomendado)**
```bash
# Levantar toda la infraestructura
docker-compose up -d

# Verificar que esté funcionando
docker-compose ps
```

### **5. Acceder a la Aplicación**
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:5000
- 🗄️ **MongoDB**: localhost:27017

---

## 🐳 Configuración con Docker

### **Docker Compose Incluido**
El proyecto incluye configuración completa de Docker:

```yaml
# docker-compose.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    container_name: perimetros_mongo
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./server
    container_name: perimetros_backend
    restart: always
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://admin:password123@mongodb:27017/perimetros?authSource=admin

volumes:
  mongodb_data:
```

### **Comandos Docker Útiles**
```bash
# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Parar servicios
docker-compose down

# Limpiar todo (⚠️ Elimina datos)
docker-compose down -v
```

### **Crear Usuario Administrador**
```bash
# Conectar a MongoDB
docker exec -it perimetros_mongo mongosh

# En MongoDB shell:
use perimetros
db.users.insertOne({
  username: "admin",
  email: "admin@perimetros.com",
  password: "$2a$10$hashedPasswordHere",
  role: "admin",
  createdAt: new Date()
})
```

---

## 🔧 Configuración Detallada

### **Configuración Base de Datos**
```javascript
// server/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### **Configuración JWT**
```javascript
// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
```

---

## 👨‍💼 Panel de Administración

### **Acceso de Administrador**
1. **URL**: `/administracion`
2. **Credenciales por defecto**:
   - Usuario: `admin`
   - Contraseña: `admin123`

### **Funcionalidades del Dashboard**

#### **1. Gestión de Cotizaciones (`/administracion/dashboard`)**
```jsx
// Características principales
- ✅ Lista completa de cotizaciones recibidas
- ✅ Vista detallada en modal responsive
- ✅ Filtrado y búsqueda en tiempo real
- ✅ Estadísticas de conversión
- ✅ Exportación de datos

// Estructura de datos de cotización
{
  "name": "Nombre del cliente",
  "rut": "12.345.678-9",
  "phone": "+56 9 1234 5678",
  "email": "cliente@email.com",
  "address": "Dirección completa",
  "fenceHeight": "1.8 metros",
  "linearMeters": "25",
  "message": "Mensaje adicional",
  "timestamp": "2024-09-30T10:30:00Z"
}
```

#### **2. Gestión de Bodega (`/administracion/bodega`)**
```jsx
// Funcionalidades CRUD completas
- ✅ Agregar nuevos productos con imágenes
- ✅ Editar productos existentes
- ✅ Eliminar productos con confirmación
- ✅ Control de stock en tiempo real
- ✅ Búsqueda avanzada con normalización
- ✅ Vista dual: tabla (desktop) + cards (móvil)

// Estructura de producto
{
  "name": "Cerco Vibrado 1.8m",
  "description": "Descripción detallada del producto",
  "price": 25000,
  "stock": 150,
  "image": "ruta/a/imagen.webp",
  "category": "cercos"
}
```

#### **3. Navegación Móvil Optimizada**
- **Botón Flotante**: Acceso rápido en dispositivos móviles
- **Offcanvas Lateral**: Menú deslizante con animaciones
- **Estado Activo**: Resaltado visual de página actual
- **Información Usuario**: Contexto del admin logueado

---

## 📱 Integración WhatsApp

### **Implementación Sin APIs Externas**
```javascript
// URLs de WhatsApp nativas
const phoneNumber = "56987761691"; // Formato internacional
const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

// Manejo robusto multi-método
const handleWhatsAppClick = (e) => {
  e.preventDefault();
  
  // Método principal: createElement + click
  const link = document.createElement('a');
  link.href = whatsappURL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Fallback para móviles
  setTimeout(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = whatsappURL;
    }
  }, 100);
};
```

### **Mensajes Contextuales**
```javascript
// Mensajes predefinidos según el contexto
const messages = {
  general: "Hola, me interesa obtener información sobre sus cercos vibrados. ¿Podrían ayudarme?",
  product: (name) => `Hola, me interesa el ${name}. ¿Podrían darme más información y cotización?`,
  quote: "Hola, me gustaría solicitar una cotización para cercos vibrados."
};
```

### **Página de Debug (`/whatsapp-test`)**
- ✅ **Información del dispositivo**: User Agent, Platform, dimensiones
- ✅ **4 URLs de prueba**: Diferentes formatos de WhatsApp
- ✅ **3 métodos de apertura**: window.location, window.open, createElement
- ✅ **Diagnóstico visual**: Compatibilidad en tiempo real

### **Compatibilidad Universal**
| Dispositivo | Método | Estado |
|-------------|--------|--------|
| iPhone (Safari) | `https://wa.me/` | ✅ App nativa |
| Android (Chrome) | `https://wa.me/` | ✅ App nativa |
| Desktop (todos) | `https://wa.me/` | ✅ WhatsApp Web |

---

## 🚀 Despliegue

### **GitHub Pages (Frontend)**
```bash
# Deploy automático configurado
npm run deploy

# Proceso automático:
# 1. npm run build → genera dist/
# 2. npx gh-pages -d dist → sube a gh-pages branch
# 3. GitHub Pages actualiza automáticamente
```

### **Backend en Producción**
```bash
# Opciones recomendadas:
1. Railway: Deploy directo desde GitHub
2. Heroku: Con MongoDB Atlas
3. DigitalOcean: VPS con Docker
4. AWS: EC2 + DocumentDB

# Variables de entorno de producción:
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=clave_super_segura_produccion
FRONTEND_URL=https://lagger-craft.github.io
```

### **Configuración de Producción**
```javascript
// vite.config.js - Build optimizado
export default defineConfig({
  base: '/PerimetrosMaitenrehue/',
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          bootstrap: ['react-bootstrap']
        }
      }
    }
  }
});
```

---

## 🛠️ Desarrollo

### **Scripts Disponibles**

#### **Frontend**
```bash
npm run dev          # Servidor de desarrollo Vite (port 5173)
npm run build        # Build de producción optimizado
npm run preview      # Preview del build local
npm run deploy       # Deploy automático a GitHub Pages
```

#### **Backend**
```bash
cd server
npm run dev          # Desarrollo con nodemon (auto-restart)
npm run start        # Producción (node server.js)
npm run start:prod   # Alias para producción
```

### **Flujo de Desarrollo**
```bash
# Terminal 1: Frontend con hot reload
npm run dev

# Terminal 2: Backend con auto-restart
cd server && npm run dev

# Terminal 3: MongoDB con Docker
docker-compose up -d mongodb

# O todo junto:
docker-compose up -d
```

### **Hot Reload Configurado**
```javascript
// Vite: Cambios en React → Recarga instantánea
// Nodemon: Cambios en server/ → Reinicio automático
// Proxy: /api requests → http://localhost:5000

// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

### **Debugging**
```javascript
// Frontend (Chrome DevTools)
console.log('Estado:', state);
console.table(usuarios);

// Backend (terminal)
console.log('Usuario autenticado:', req.user);

// MongoDB (logs)
mongoose.set('debug', true); // Solo desarrollo
```

---

## 📱 Compatibilidad

### **Navegadores Soportados**
| Navegador | Versión | Desktop | Móvil | Estado |
|-----------|---------|---------|-------|--------|
| Chrome | 90+ | ✅ | ✅ | Completo |
| Firefox | 88+ | ✅ | ✅ | Completo |
| Safari | 14+ | ✅ | ✅ | Completo |
| Edge | 90+ | ✅ | ✅ | Completo |

### **Dispositivos Móviles Testados**
- ✅ **iPhone 12/13/14/15** (todas las variantes)
- ✅ **Samsung Galaxy S20/S21/S22**
- ✅ **iPad Air/Pro** (layout tablet optimizado)
- ✅ **Android tablets** 10"+

### **Resoluciones Soportadas**
- ✅ **Mobile**: 320px - 767px
- ✅ **Tablet**: 768px - 991px
- ✅ **Desktop**: 992px - 1199px
- ✅ **Large**: 1200px+
- ✅ **4K**: 3840px+ (escalado automático)

---

## 🔗 Enlaces Importantes

### **Producción**
- 🌐 **Sitio Web**: https://lagger-craft.github.io/PerimetrosMaitenrehue/
- 📋 **Panel Admin**: https://lagger-craft.github.io/PerimetrosMaitenrehue/administracion
- 🧪 **Debug WhatsApp**: https://lagger-craft.github.io/PerimetrosMaitenrehue/whatsapp-test

### **Desarrollo**
- 🌐 **Frontend Local**: http://localhost:5173
- 🔧 **Backend Local**: http://localhost:5000
- 🗄️ **MongoDB Local**: mongodb://localhost:27017

### **Contacto**
- 📱 **WhatsApp**: [+56 9 8776 1691](https://wa.me/56987761691)
- 📧 **Email**: info@perimetrosmaitenrehue.cl
- 📍 **Ubicación**: Sur de Chile

---

## 📞 Soporte

### **Documentación Técnica**
- Ver carpeta `/Informes/` para reportes detallados
- Revisar comentarios en el código para implementación
- Consultar `/whatsapp-test` para debug de WhatsApp

### **Reportar Problemas**
1. **GitHub Issues**: Para bugs del código
2. **WhatsApp**: Para soporte directo
3. **Email**: Para consultas comerciales

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver archivo `LICENSE` para detalles.

---

<div align="center">

**Desarrollado con ❤️ para PerímetrosMaitenrehue**

[![GitHub Stars](https://img.shields.io/github/stars/Lagger-craft/PerimetrosMaitenrehue?style=social)](https://github.com/Lagger-craft/PerimetrosMaitenrehue/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Lagger-craft/PerimetrosMaitenrehue?style=social)](https://github.com/Lagger-craft/PerimetrosMaitenrehue/network/members)

**Versión 2.0** - Optimizado para móviles y desktop  
**Última actualización**: 30 de Septiembre 2024

[⬆️ Volver al inicio](#-perímetrosmaitenrehue---sitio-web-completo)

</div>