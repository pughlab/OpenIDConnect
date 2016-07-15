var express = require('express'); 
var router = express.Router(); 
var oidc = require('./oidc');

//Login form (I use email as user name)
router.get('/', function(req, res, next) {
  res.render('login'); 
});

var validateUser = function (req, next) {
  delete req.session.error;
  req.model.user.findOne({email: req.body.email}, function(err, user) {
    if (err) throw err; 
    if (!user) {
      return next(null, false, {message: "Check email/password and try again."}); 
    }

    user.comparePassword(req.body.password, user.password, function(err, isMatch) {
      if (err) throw err; 
      if (isMatch) {
        return next(null, user);
      } else {
        return next(null, false, {message: "Check email/password and try again."});
      }
    });
  });
};

var afterLogin = function (req, res, next) {
    res.redirect(req.param('return_url')||'/user');
};

var loginError = function (err, req, res, next) {
    req.session.error = err.message;
    res.redirect(req.path);
};

router.all('/logout', oidc.removetokens(), function(req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});

router.post('/', oidc.login(validateUser), afterLogin, loginError);

module.exports = router; 