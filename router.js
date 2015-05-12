module.exports = function(app, db) {

  // Middleware to use for all requests - test only
  app.all('*', function(req, res, next) {
    console.log('request being processed');
    next();
  });

  // Cross Origin Resource Sharing (CORS)
  var cors = require('cors');
  app.use(cors());

  // Define Namespaced API Router
  var apiRouter = require('express').Router();

  apiRouter.options('*', cors());

  // API Routes
  require('./routes/api/user')(app, db, apiRouter);
  require('./routes/api/airtime')(app, db, apiRouter);
  require('./routes/api/login')(app, db, apiRouter);

  app.use('/api/v1', apiRouter);

  // Static pages routes
  app.get('/', require('./routes/index'));

  // 404 error handler
  app.get('*', function(req, res) {
    res.render('404', 404);
  });

  // 500 error handler --> production only
  // need to improve 500 logging
  app.use(function(error, req, res) {
    res.render('500', { title:'500: Internal Server Error', error: error });
  });

  // ensure request is application/json
  function ensureJSON(req, res, next) {
    if ( ! req.is('application/json') ) {
      res.status(400).json({ 'Error': 'Bad Request' });
    } return next();
  }

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } res.redirect('/login');
  }

};
