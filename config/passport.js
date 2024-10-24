const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

// Verifica que JWT_SECRET se está cargando correctamente
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req?.cookies?.token, // Extraer desde la cookie
  ]),
  secretOrKey: process.env.JWT_SECRET, // Usar la clave secreta desde .env
};

// Estrategia de Passport con JWT
passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;

console.log(process.env);

