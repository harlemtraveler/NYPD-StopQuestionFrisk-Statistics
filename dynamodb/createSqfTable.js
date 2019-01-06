const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1",
  endpoint: "http://localhost:8000"
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: "sqfDB",
  "KeySchema": [
    // Partition Key
    { AttributeName: "STOP_FRISK_ID", "KeyType": "HASH" },
  ],
  AttributeDefinitions: [
    { AttributeName: "STOP_FRISK_ID", AttributeType: "N" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.log("Unable to create table. Error JSON: ", JSON.stringify(err, null, 2));
  } else {
    console.log("Created table. Table Description JSON: ", JSON.stringify(data, null, 2));
  }
});
