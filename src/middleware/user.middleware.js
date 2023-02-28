const User = require('../models/user');

function authMiddleware(req, res, next) {
  const { correo, password } = req.body;

  User.findOne({ correo }, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!user) {
      console.log('Invalid username or password');
    }

    user.isCorrectPassword(password, (err, isMatch) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (isMatch) {
        // Si el inicio de sesión es exitoso, restablecemos el número de intentos fallidos
        user.loginAttempts = 0;
        user.lockUntil = null;
        user.save((err) => {
          if (err) {
            return res.status(500).send(err);
          }
          req.user = user;
          next();
        });
      } else {
        // Si el inicio de sesión falla, incrementamos el número de intentos fallidos
        user.loginAttempts += 1;

        // Si el número de intentos fallidos supera el límite, bloqueamos al usuario
        if (user.loginAttempts >= 5 && !user.isLocked()) {
          user.lockUntil = Date.now() + 60 * 60 * 1000; // Bloquear durante 1 hora
          user.save((err) => {
            if (err) {
              return res.status(500).send(err);
            }
            return res.status(401).send('Your account has been locked');
          });
        } else {
          user.save((err) => {
            if (err) {
              return res.status(500).send(err);
            }
            return res.status(401).send('Invalid username or password');
          });
        }
      }
    });
  });
}

module.exports = authMiddleware;

  
  
  
  