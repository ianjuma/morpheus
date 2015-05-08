var express = require('express');
var app = express();

//Load Environment Specific Details
require('dotenv').load();
var models = require('./models');

var bootstrap = require('./bootstrap');

//Bootstrap the App
bootstrap(app, express);

app.set('port', process.env.PORT || 8000);

models.sequelize.sync({logging: false}).then(function () {
  var server = app.listen(app.get('port'), function() {
    console.log('Magic happens on port ' + server.address().port);
  });
});
