
/**
 * Module dependencies.
 */

var express = require('express'),
    expressSession = require('express-session'),
    expressValidator = require('express-validator'),
    http = require('http'),
    path = require('path'),
    knex = require('knex'),
    connectSessionKnex = require('connect-session-knex'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override');

var user = require('./routes/user'); 
var register = require('./routes/register'); 
var client = require('./routes/client'); 
var login = require('./routes/login'); 
var test = require('./routes/test'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// all environments
app.set('port', process.env.PORT || 3001);
app.use(logger('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser('Some Secret!!!'));


var databaseOptions = {};
databaseOptions.client = 'sqlite3';
databaseOptions.connection = {filename: './dev.sqlite3'};
var database = knex(databaseOptions);

var sessionOptions = {};
var SessionStore = connectSessionKnex(expressSession, {transactional: true});
sessionOptions.store = new SessionStore({tablename: 'sessions', knex: database});
app.use(expressSession(sessionOptions));

// Express Validator 
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Routes 
app.use('/user', user);
app.use('/login', login);
app.use('/register', register); 
app.use('/client', client);
app.use('/test', test);


//redirect to login
app.get('/', function(req, res) {
  res.redirect('/login');
});

// //User Info Endpoint
// app.get('/api/user', oidc.userInfo());

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

 var clearErrors = function(req, res, next) {
   delete req.session.error;
   next();
 };

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
