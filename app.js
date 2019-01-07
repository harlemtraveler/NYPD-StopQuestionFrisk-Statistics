const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const AWS = require('aws-sdk');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// AWS Credentials
const accessKeyId = require('./config/keys').accessKeyId;
const secretAccessKey = require('./config/keys').secretAccessKey;

const app = express();

const PORT = process.env.PORT || 5000;

const awsConfig = {
  "region": "us-east-1",
  "endpoint": "https://dynamodb.us-east-1.amazonaws.com",
  "accessKeyId": accessKeyId
};

// AWS Configuration
AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();

// Path to scan all SQF records
app.get('/frisks', (req, res) => {
  const dbParams = require('./dynamodb/paramData').dbParams;
  const params = dbParams;

  console.log("Scanning sqfDB table.");
  docClient.scan(params, onScan);

  // const fetchAllByKey = () => {};

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

      // if (typeof data.LastEvaluatedKey != "undefined") {
      //   console.log("Scanning for more...");
      //   params.ExclusiveStartKey = data.LastEvaluatedKey;
      //   docClient.scan(params, onScan);
      // }
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

app.listen(PORT, () => {
  console.log(`[*] Server Listening on Port: ${PORT} 🚦`);
});

module.exports = app;
