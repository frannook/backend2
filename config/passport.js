const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,  // Asegúrate de tener la clave secreta en el archivo .env
};

// Configurar estrategia JWT para autenticación
passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      // Buscar al usuario por el ID contenido en el token
      const user = await User.findById(jwtPayload.id);

      if (user) {
        return done(null, user); // Usuario autenticado
      } else {
        return done(null, false); // Usuario no encontrado
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
