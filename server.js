const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const sessionRoutes = require('./routes/sessions');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
