require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const rateLimit = require('express-rate-limit');

const app = express();

// Apply global rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development - Limit each IP to 1000 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for localhost during development
    return req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
  }
});

// Apply stricter rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 5 to 20 for development - Limit each IP to 20 requests per windowMs
  message: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 15 minutos',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost during development
    return req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
  }
});

// Connect Database
connectDB();

// Init Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://lagger-craft.github.io'],
  credentials: true
}));
app.use(express.json({ extended: false }));

// Make uploads folder publicly accessible
app.use('/uploads', express.static('uploads'));

// Apply the global rate limiter to all requests (disabled for development)
// app.use(apiLimiter);

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quotes', require('./routes/quotes'));
app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
