var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});
var documentClient = new AWS.DynamoDB.DocumentClient();

var fs = require("fs");

var sleep = require("sleep");

var sqfData = fs.readFileSync("StopQuestionFrisk.json");
var jsonContent = JSON.parse(sqfData);

for (entry in jsonContent) {
    console.log("THIS IS THE ENTRY")
    console.log(jsonContent[entry])

    var params = {
        TableName : "StopQuestionFriskDB",
        Item: jsonContent[entry]
    };

    documentClient.put(params, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
    });
    sleep.msleep(300)
}
