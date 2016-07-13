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
  req.model.user.findOne({email: req.body.email}, function(err, user) {
      if(err) {
          req.session.error=err;
          console.log(req.session.error); 
      } else if(user) {
          req.session.error='User already exists.';
          console.log(req.session.error); 
      }
      if(req.session.error) {
          res.redirect(req.path);
      } else {
          req.body.name = req.body.given_name+' '+(req.body.middle_name?req.body.middle_name+' ':'')+req.body.family_name;
          req.model.user.create(req.body, function(err, user) {
             if(err || !user) {
                 req.session.error=err?err:'User could not be created.';
                 console.log(req.session.error); 
                 res.redirect(req.path);
             } else {
                 req.session.user = user.id;
                 res.redirect('/user');
             }
          });
      }
  });
});

module.exports = router; 