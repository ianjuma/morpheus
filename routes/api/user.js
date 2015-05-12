/**
 * User Resource
 * @param {Object} app
 * @param {Object} db Sequelize models
 * @param {Object} apiRouter API Router with api version prefix
 * @exports User Resource
 */
module.exports = function(app, db, apiRouter) {

  // TODO: on-boarding process for user?
  var UserResource = require('express').Router({ mergeParams: true });

  /**
   * Returns a list of all users available to the requesting user
   * @return {Array} JSON array of users
   */
  UserResource.get('/', function(req, res) {
    db.User.findAll({ include: [{ all: true, nested: true }]})
      .then(function(users) {
        res.status(200).json(users);
      })
      .on('error', function(err) {
        res.status(500).json({ error: err });
      });
  });

  /**
   * Return the specified user
   * @params {Integer} id ID of the user being requested
   * @return {Array} JSON array of user by ID
   */
  UserResource.get('/:id', function(req, res) {
    db.User.find(req.params.id)
      .then(function(user) {
        if (user !== null) {
          res.status(200).json( user );
        } else {
          res.status(404).json({ error: 'User not found'});
        }
      })
      .on('error', function(err) {
        if (err.name === 'SequelizeDatabaseError') {
          res.status(400).json({ error: 'Wrong Input' });
        } else {
          res.status(500).json({ error: err });
        }
      });
  });

  /**
   * Creates a new user from the parameters passed
   * @return {Object} JSON object of user created
   */
  UserResource.post('/', function (req, res) {
    db.User.create({
      phoneNumber: req.body.phoneNumber,
      encrypted_pin: req.body.encrypted_pin
    }).then(function(user) {
      res.status(201).json( user );
    }).on('error', function (err) {
      if (err.name === 'SequelizeValidationError') {
        res.status(409).json({ error: err.message });
      } else if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({ error: 'User already exists' });
      } else {
        res.status(500).json({ error: err });
      }
    });
  });

  /**
   * Updates user specified from the parameters passed
   * @param {Number} id ID of user being updated
   * @return {Object} JSON object of updated user
   */
  UserResource.put('/:id', function (req, res) {
    db.User.find(req.params.id)
      .then(function(user) {
        if (user !== null) {
          user.phoneNumber = req.body.phoneNumber;
          user.encrypted_pin = req.body.encrypted_pin;

          user.save()
            .then(function(user) {
              res.status(200).json(user);
            })
            .on('error', function(err) {
              if (err.name === 'SequelizeValidationError') {
                res.status(409).json({ error: err.message });
              } else {
                res.status(500).json({error: err});
              }
            });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
      .on('error', function(err) {
        if (err.name === 'SequelizeValidationError') {
          res.status(409).json({ error: err.message });
        } else if (err.name === 'SequelizeDatabaseError') {
          res.status(400).json({ error: 'Wrong Input' });
        } else {
          res.status(500).json({ error: err });
        }
      });
  });


  /**
   * Delete the user specified and returns 204 No Content if that was successful.
   * If the user does not have access to delete the person, you'll see 403 Forbidden.
   *
   * @param {Number} id ID of user being removed from storage.
   * @return {Empty} Returns 204 Status Code
   */
  UserResource.delete('/:id', function (req, res) {
    // remove a user from the listing - profile owner can
    db.User.find(req.params.id)
      .then(function(user) {
        if (user !== null) {
          user.destroy()
            .then(function() {
              res.status(204).send('');
            });
        } else {
          res.status(404).json({ error: 'User not found'});
        }
      })
      .on('error', function(err) {
        res.status(500).json({ error: err });
      });
  });

  /**/
  apiRouter.use('/user', UserResource);

};


