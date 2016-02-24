'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt:     DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: encryptPassword,
      beforeUpdate: encryptPassword
    },
    instanceMethods: {
      comparePassword: function(candidatePassword, callback) {
        bcrypt.compare(candidatePassword, this.getDataValue('password'), function(err, isMatch) {
          if (err) return callback(err);
          callback(null, isMatch);
        });
      }
    }
  });
  return User;
};

function encryptPassword (model, options) {
  return new Promise(function (resolve, reject) {
    if (!model.changed('password')) return;

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(model.password, salt, function(error, hash) {
        var result = {hash: hash, salt: salt};
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      });
    });
  })
  .then(function(encryptResult) {
    model.password = encryptResult.hash;
    model.salt = encryptResult.salt;
  });
}