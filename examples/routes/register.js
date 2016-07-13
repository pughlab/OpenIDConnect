// Remove this route after the files have been split. 
// Users that stumble upon the site should not be able to 
// register an account. This should be restricted to admin users.
var express = require('express'); 
var router = express.Router(); 
var oidc = require('./oidc');

//user creation form
router.get('/', function(req, res, next) {
  res.render('register');
});

//process user creation
router.post('/', oidc.use({policies: {loggedIn: false}, models: 'user'}), function(req, res, next) {
  delete req.session.error;

  var given_name = req.body.given_name;
  var family_name = req.body.family_name;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  req.checkBody('given_name', 'First name is required').notEmpty(); 
  req.checkBody('family_name', 'Last name is required').notEmpty(); 
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors(); 

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    req.model.user.create(req.body, function (err, user) {
      if (err) throw err; 
      console.log(user); 

      // Add flash message here? 
      req.session.user = user.id; 
      res.redirect('/user');
    });
  }
});

module.exports = router; 