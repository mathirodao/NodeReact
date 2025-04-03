// app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cookieParser = require('cookie-parser');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
app.use(cookieParser());

// Middleware de CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Usar `true` en producción con HTTPS
      httpOnly: true, // Prevenir acceso desde JavaScript
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Usar 'none' en producción con HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la sesión (24 horas)
    },
    rolling: true, // Renovar la expiración de la cookie en cada solicitud
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});