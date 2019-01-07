const AWS = require('aws-sdk');

// AWS Credentials
const accessKeyId = require('../config/keys').accessKeyId;
const secretAccessKey = require('../config/keys').secretAccessKey;

const awsConfig = {
  "region": "us-east-1",
  "endpoint": "https://dynamodb.us-east-1.amazonaws.com",
  "accessKeyId": accessKeyId
};

AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();

const table = "StopQuestionFriskDB";
const STOP_FRISK_ID = 1;

const params = {
  TableName: table,
  Key: { "STOP_FRISK_ID": STOP_FRISK_ID }
};

docClient.get(params, (err, data) => {
  if (err) {
    console.log("Unable to read item. Error JSON: ", JSON.stringify(err, null, 2));
  } else {
    console.log("GetItem succeeded: ", JSON.stringify(data, null, 2));
  }
});
