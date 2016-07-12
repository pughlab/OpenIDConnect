// Remove this route after the files have been split. 
// Users that stumble upon the site should not be able to 
// register an account. This should be restricted to admin users.
var express = require('express'); 
var router = express.Router(); 

// Get /register route
router.get('/', function (req, res) {
  res.render('register'); 
});

router.post('/', function (req, res) {

});

module.exports = router; 