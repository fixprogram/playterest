module.exports = {
    getPassport: function() {
        const passport = require('passport');
        const SteamStrategy = require('./lib/passport-steam').Strategy;
        
        passport.serializeUser(function(user, done) {
            done(null, user);
          });
          
        passport.deserializeUser(function(obj, done) {
          done(null, obj);
        });
          
        passport.use(new SteamStrategy({
          returnURL: 'https://myappest.herokuapp.com/auth/steam/return',
          realm: 'https://myappest.herokuapp.com/',
          apiKey: 'CFB0BB3EDA8D5FD2342384380B442CC9'
        },
        function(identifier, profile, done) {
          process.nextTick(function () {
            profile.identifier = identifier;
            return done(null, profile);
          });
        }
        ));

      return passport;
    }
};