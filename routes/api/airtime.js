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
    db.Airtime.findAll({where: {} })
      .then(function(listings) {
        if (typeof(listings) !== 'undefined' ) {
          res.status(404).json({ error: 'No Available Listings' });
        } else {
          res.status(200).json(listings);
        }
      })
      .on('error', function(err) {
        if (err.name === 'SequelizeDatabaseError') {
          res.status(400).json({ error: err.message.replace('column ', 'Search term ').replace('Airtime.', '') });
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
    db.Airtime.find(req.body.license_plate)
      .then(function(airtime) {
        if (airtime !== null) {

          airtime.amount = req.body.amount;
          airtime.to = req.body.to;

          airtime.save()
            .then(function(airtime) {
              res.status(200).json(airtime);
            })
            .on('error', function(err) {
              if (err.name === 'SequelizeValidationError') {
                res.status(400).json({ error: err.message });
              } else if (err.name === 'SequelizeDatabaseError') {
                res.status(400).json({ error: err.message });
              } else {
                res.status(500).json({ error: err });
              }
            });
        } else {
          res.status(404).json({ error: 'Airtime not found' });
        }
      })
      .on('error', function(err) {
        res.status(500).json({ error: err });
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
          res.status(404).json({ error: 'Airtime not found'});
        }
      })
      .on('error', function(err) {
        res.status(500).json({ error: err });
      });
  });

  apiRouter.use('/airtime', AirtimeResource);
};
