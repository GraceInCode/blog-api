const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); // For password comparison
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = (passport) => {
  // Local Strategy for username/password login
  passport.use(new LocalStrategy(
    { usernameField: 'username' }, // Assuming username; change if using email
    async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return done(null, false, { message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Incorrect password' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // JWT Strategy (already there)
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  };
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } });
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }));
};