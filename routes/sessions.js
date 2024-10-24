const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');

const router = express.Router();

// Ruta para el login del usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta /current para obtener datos del usuario autenticado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
