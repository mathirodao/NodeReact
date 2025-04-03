const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();

connectDB(); 

const app = express();
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
    rolling: true,
  })
);


app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});