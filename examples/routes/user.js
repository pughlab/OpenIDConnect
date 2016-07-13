var express = require('express'); 
var router = express.Router(); 
var oidc = require('./oidc');

//authorization endpoint
router.get('/authorize', oidc.auth());

//token endpoint
router.post('/token', oidc.token());

//user consent form
router.get('/consent', function(req, res, next) {
  var head = '<head><title>Consent</title></head>';
  var lis = [];
  for(var i in req.session.scopes) {
    lis.push('<li><b>'+i+'</b>: '+req.session.scopes[i].explain+'</li>');
  }
  var ul = '<ul>'+lis.join('')+'</ul>';
  var error = req.session.error?'<div>'+req.session.error+'</div>':'';
  var body = '<body><h1>Consent</h1><form method="POST">'+ul+'<input type="submit" name="accept" value="Accept"/><input type="submit" name="cancel" value="Cancel"/></form>'+error;
  res.send('<html>'+head+body+'</html>');
});

//process user consent form
router.post('/consent', oidc.consent());

router.get('/', oidc.check(), function(req, res, next){
  res.send('<h1>User Page</h1><div><a href="/client">See registered clients of user</a></div>');
});

//User Info Endpoint
//router.get('/api/user', oidc.userInfo());

router.get('/foo', oidc.check('foo'), function(req, res, next){
  res.send('<h1>Page Restricted by foo scope</h1>');
});

router.get('/bar', oidc.check('bar'), function(req, res, next){
  res.send('<h1>Page restricted by bar scope</h1>');
});

router.get('/and', oidc.check('bar', 'foo'), function(req, res, next){
  res.send('<h1>Page restricted by "bar and foo" scopes</h1>');
});

router.get('/or', oidc.check(/bar|foo/), function(req, res, next){
  res.send('<h1>Page restricted by "bar or foo" scopes</h1>');
});

module.exports = router; 