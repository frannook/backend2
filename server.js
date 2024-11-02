const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const sessionRoutes = require('./routes/sessions');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');  // Nueva ruta de autenticación
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);  // Agregar las rutas de autenticación

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
