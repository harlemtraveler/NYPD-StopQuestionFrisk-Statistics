var createError = require('http-errors');
var express = require('express');
var path = require('path');
const favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const AWS = require('aws-sdk');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// AWS Configuration
AWS.config.update({
  // accessKeyId: "",
  // secretAccessKey: "",
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

// Path to scan all SQF records
app.get('/frisks', (req, res) => {
  const dbParams = require('./paramData').dbParams;
  const params = dbParams;

  console.log("Scanning sqfDB table.");
  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      console.log('Unable to scan the table. Error JSON: ', JSON.stringify(err, null, 2));
    } else {
      res.send(data);
      // Print all the Stop&Frisk records
      console.log("Scan succeeded.");
      data.Items.forEach((sqf) => {
        console.log(`
          Record #${sqf.STOP_FRISK_ID}:\n
          Date: ${sqf.STOP_FRISK_DATE}\n
          Citizen Age: ${sqf.SUSPECT_REPORTED_AGE}\n
          Citizen's Sex: ${sqf.SUSPECT_SEX}\n
          Citizen's Race: ${sqf.SUSPECT_RACE_DESCRIPTION}\n
          Borough: ${sqf.STOP_LOCATION_BORO_NAME}
        `);
      });

      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      }
    }
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
