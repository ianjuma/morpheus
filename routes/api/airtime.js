/**
 * Vehicle Listing Resource
 * @param {Object} app
 * @param {Object} db Sequelize models
 * @param {Object} apiRouter API Router with api version prefix
 * @param {Object} auth
 * @exports Vehicle Listings Resource
 */
module.exports = function(app, db, apiRouter) {

  var AirtimeResource = require('express').Router({ mergeParams: true });

  /**
   * Returns a list of all vehicle listings available to the requesting user
   * @return {Array} JSON array of vehicle listings
   */
  AirtimeResource.get('/', function(req, res) {
    //Build query conditions
    db.Airtime.findAll({ include: [{ all: true, nested: true }]})
      .then(function(logs) {
        if (typeof(logs) !== 'undefined' ) {
          res.status(404).json({ error: 'No Available Airtime logs' });
        } else {
          res.status(200).json(logs);
        }
      })
      .on('error', function(err) {
        if (err.name === 'SequelizeDatabaseError') {
          res.status(400).json({ error: err.message});
        } else {
          res.status(500).json({ error: err });
        }
      });
  });


  /**
   * Creates a new Airtime listing from the parameters passed
   * This updates an already existing Airtime in storage
   * @param {Number} id ID of Airtime being updated
   * @return {Object} JSON object of Airtime updated in storage
   */
  AirtimeResource.post('/', function (req, res) {
    db.Airtime.create({
      amount: req.body.amount,
      to: req.body.to,
      status: "PENDING"
    }).then(function(log) {
      res.status(201).json( log );
    }).on('error', function (err) {
      if (err.name === 'SequelizeValidationError') {
        res.status(409).json({ error: err.message });
      } else if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'Log Exists' });
      } else {
        res.status(500).json({ error: err });
      }
    });
  });


  /**
   * Returns the Airtime airtime specified
   * @param {Number} id airtime ID of the Airtime being requested
   * @return {Object} JSON object of Airtime airtime being requested
   */
  AirtimeResource.get('/:id', function(req, res) {
    db.Airtime.find(req.params.id)
      .then(function(airtime) {
        if (airtime !== null) {
          res.status(200).json(airtime);
        } else {
          res.status(404).json({ error: 'Airtime Log not found'});
        }
      })
      .on('error', function(err) {
        res.status(500).json({ error: err });
      });
  });

  apiRouter.use('/airtime', AirtimeResource);
};
