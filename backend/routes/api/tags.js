const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

router
  .route("/")

  // get all tags
  .get((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    let params = {
      TableName: "notesTable",
      KeyConditionExpression: "userID=:u AND noteID=:tags",
      ExpressionAttributeValues: {
        ":u": req.user.sub,
        ":tags": "tags",
      },
      ScanIndexForward: false,
    };
    // console.log(req.user);
    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.query(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  });

router
  .route("/:tag_name")

  // create tag
  .post((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });
    const docClient = new AWS.DynamoDB.DocumentClient();

    let params = {
      TableName: "notesTable",
      Key: {
        userID: req.user.sub,
        noteID: "tags",
      },
      UpdateExpression: "add #names :tag_name",
      ExpressionAttributeNames: {
        "#names": "names",
      },
      ExpressionAttributeValues: {
        ":tag_name": docClient.createSet([req.params.tag_name]),
      },
      ReturnConsumedCapacity: "TOTAL",
    };

    docClient.update(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  })

  // delete tag
  .delete((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    let params = {
      TableName: "notesTable",
      Key: {
        userID: req.user.sub,
        noteID: "tags",
      },
      UpdateExpression: "delete #names :tag_name",
      ExpressionAttributeNames: {
        "#names": "names",
      },
      ExpressionAttributeValues: {
        ":tag_name": req.params.tag_name,
      },
      ReturnConsumedCapacity: "TOTAL",
    };

    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.update(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  });

module.exports = router;
