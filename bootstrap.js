module.exports = function(app, express) {

  var exphbs = require('express-handlebars');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var fs = require('fs');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var RedisStore = require('connect-redis')(session);
  var errorhandler = require('errorhandler');
  var flash = require('connect-flash');

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    compilerOptions: undefined
  }));
  app.set('view engine', 'handlebars');
  app.set('trust proxy', 'loopback');

  // redis session config
  var config = require('./config/database');

  // setup the logger and only log errors
  var accessLogStream = fs.createWriteStream('morpheus.log', {
    flags: 'a'
  });
  app.use(logger('combined', {
    stream: accessLogStream,
    skip: function(req, res) {
      return res.statusCode < 400;
    }
  }));


  app.use(favicon(__dirname + '/public/assets/images/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cookieParser('session_secret'));

  app.use(session({
    secret: 'session_secret',
    cookie: {
      secure: false,
      expires: false
    },
    resave: true,
    saveUninitialized: true,
    store: new RedisStore(config.redis)
  }));

  app.use(express.static(path.join(__dirname, 'assets')));

  // TODO: check env then set appropriate error handlers
  app.use(errorhandler({
    dumpExceptions: true,
    showStack: true
  }));

  // Models
  var db = require('./models');

  //Routes
  require('./router')(app, db);

};
