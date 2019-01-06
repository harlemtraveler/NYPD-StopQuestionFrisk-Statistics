const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const table = "sqfDB";

const STOP_FRISK_ID = 1;

const params = {
  TableName: table,
  Key: {
    "STOP_FRISK_ID": STOP_FRISK_ID
  }
};

docClient.get(params, (err, data) => {
  if (err) {
    console.log("Unable to read item. Error JSON: ", JSON.stringify(err, null, 2));
  } else {
    console.log("GetItem succeeded: ", JSON.stringify(data, null, 2));
  }
});
