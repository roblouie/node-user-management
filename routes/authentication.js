var User = require('../models').User;

exports.register = function(req, res) {
  User
    .build({ username: req.body.username, password: req.body.password })
    .save()
    .then(function(savedUser) {
   	  console.log('User created');
    })
    .error(function(error) {
    	console.log('Error: ' + error);
    })
};

