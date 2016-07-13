var express = require('express'); 
var router = express.Router(); 
var oidc = require('./oidc');

//Login form (I use email as user name)
router.get('/', function(req, res, next) {
  var head = '<head><title>Login</title></head>';
  var inputs = '<input type="text" name="email" placeholder="Enter Email"/><input type="password" name="password" placeholder="Enter Password"/>';
  var error = req.session.error?'<div>'+req.session.error+'</div>':'';
  var body = '<body><h1>Login</h1><form method="POST">'+inputs+'<input type="submit"/></form>'+error;
  res.send('<html>'+head+body+'</html>');
});

var validateUser = function (req, next) {
  delete req.session.error;
  req.model.user.findOne({email: req.body.email}, function(err, user) {
      if(!err && user && user.samePassword(req.body.password)) {
        return next(null, user);
      } else {
        var error = new Error('Username or password incorrect.');
        return next(error);
      }
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
