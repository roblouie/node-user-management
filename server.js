var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt = require('jwt-simple');
var auth = require('./routes/authentication');
var models = require('./models');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

require('./config/passport')(passport);

app.post('/auth/register', auth.register);

models.sequelize.sync().then(function () {
  app.listen(port, function() {
    console.log('App running on port ' + port);
  });
});