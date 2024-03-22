var express = require('express');
var createError = require('http-errors');
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');

var authRoute = require('./routes/authRoute');
var userRoleRoute = require('./routes/userRoleRoute');

const verifyAuth  = require('./middlewares/verifyAuth');

var app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoute);
app.use('/api/role', userRoleRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({ error: 'Not found' })
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).send({ error: err })
});

module.exports = app;
