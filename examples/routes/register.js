// Remove this route after the files have been split. 
// Users that stumble upon the site should not be able to 
// register an account. This should be restricted to admin users.
var express = require('express'); 
var router = express.Router(); 
var oidc = require('./oidc');

//user creation form
router.get('/', function(req, res, next) {
  var head = '<head><title>Sign in</title></head>';
  var inputs = '';
  var fields = {
          given_name: {
              label: 'Given Name',
              type: 'text'
          },
          middle_name: {
              label: 'Middle Name',
              type: 'text'
          },
          family_name: {
              label: 'Family Name',
              type: 'text'
          },
          email: {
              label: 'Email',
              type: 'email'
          },
          password: {
              label: 'Password',
              type: 'password'
          },
          passConfirm: {
              label: 'Confirm Password',
              type: 'password'
          }
  };
  for(var i in fields) {
    inputs += '<div><label for="'+i+'">'+fields[i].label+'</label><input type="'+fields[i].type+'" placeholder="'+fields[i].label+'" id="'+i+'"  name="'+i+'"/></div>';
  }
  var error = req.session.error?'<div>'+req.session.error+'</div>':'';
  var body = '<body><h1>Sign in</h1><form method="POST">'+inputs+'<input type="submit"/></form>'+error;
  res.send('<html>'+head+body+'</html>');
});

//process user creation
router.post('/', oidc.use({policies: {loggedIn: false}, models: 'user'}), function(req, res, next) {
  delete req.session.error;
  req.model.user.findOne({email: req.body.email}, function(err, user) {
      if(err) {
          req.session.error=err;
      } else if(user) {
          req.session.error='User already exists.';
      }
      if(req.session.error) {
          res.redirect(req.path);
      } else {
          req.body.name = req.body.given_name+' '+(req.body.middle_name?req.body.middle_name+' ':'')+req.body.family_name;
          req.model.user.create(req.body, function(err, user) {
             if(err || !user) {
                 req.session.error=err?err:'User could not be created.';
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