module.exports = function(app, db, apiRouter) {

  var LoginResource = require('express').Router({ mergeParams: true });

  LoginResource.post('/', function (req, res) {
    db.User.find(req.body.phoneNumber).then(function(user) {
      if (user !== null) {
        if (req.body.encrypted_pin !== user.encrypted_pin) {
          res.status(400).json( { "Error": "Incorrect Pin" } );
        } else res.status(200).json( user );
    } else res.status(400).json( { "Error": "User Not Found" } );
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

  /**/
  apiRouter.use('/login', LoginResource);

};


