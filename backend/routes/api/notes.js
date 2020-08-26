const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const nanoid = require("nanoid").nanoid;

router
  .route("/")

  // get all notes
  .get((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    let params = {
      TableName: "notesTable",
      IndexName: "lastEdit",
      KeyConditionExpression: "userID=:u",
      ExpressionAttributeValues: {
        ":u": req.user.sub,
      },
      ScanIndexForward: false,
    };
    // console.log(req.user);
    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.query(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  })

  // create new note
  .post((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });
    const docClient = new AWS.DynamoDB.DocumentClient();

    let currTime = Date.now() / 1e3;
    const newNote = {
      userID: req.user.sub,
      noteID: nanoid(),
      creationTimestamp: currTime,
      lastEditTimestamp: currTime,
      title: "",
      body: "",
    };

    let params = {
      TableName: "notesTable",
      Item: newNote,
    };

    docClient.put(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.status(201).json(newNote);
    });
  });

router
  .route("/:id")

  // get note
  .get((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    let params = {
      TableName: "notesTable",
      Key: {
        userID: req.user.sub,
        noteID: req.params.id,
      },
    };

    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.get(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  })

  // update note
  .put((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    let params = {
      TableName: "notesTable",
      Key: {
        userID: req.user.sub,
        noteID: req.params.id,
      },
      UpdateExpression: "set title=:t, body=:b, lastEditTimestamp=:ts",
      ExpressionAttributeValues: {
        ":t": req.body.title,
        ":b": req.body.body,
        ":ts": Date.now() / 1e3,
      },
      ReturnValues: "UPDATED_NEW",
      // ReturnConsumedCapacity: "TOTAL",
    };

    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.update(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  })

  // delete note
  .delete((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    let params = {
      TableName: "notesTable",
      Key: {
        userID: req.user.sub,
        noteID: req.params.id,
      },
    };

    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.delete(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  });

router
  .route("/tag/:id")

  // add/delete tag
  .patch((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });
    const docClient = new AWS.DynamoDB.DocumentClient();
    let params = {
      TableName: "notesTable",
      Key: {
        userID: req.user.sub,
        noteID: req.params.id,
      },
      UpdateExpression: `${req.body.action} tags :tag`, // action: ADD or DELETE
      ExpressionAttributeValues: {
        ":tag": docClient.createSet([req.body.tag]),
      },
      ReturnValues: "ALL_NEW",
      ReturnConsumedCapacity: "TOTAL",
    };

    docClient.update(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  });

router
  .route("/search/:query")

  // query
  .get((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    let params = {
      TableName: "notesTable",
      IndexName: "lastEdit",
      KeyConditionExpression: "userID=:u",
      FilterExpression: "contains (title, :q) OR contains (body, :q)",
      ExpressionAttributeValues: {
        ":u": req.user.sub,
        ":q": req.params.query,
      },
      ScanIndexForward: false,
    };
    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.query(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  });

router
  .route("/search/tag/:tag")

  // query
  .get((req, res) => {
    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://localhost:8000",
    });

    let params = {
      TableName: "notesTable",
      IndexName: "lastEdit",
      KeyConditionExpression: "userID=:u",
      FilterExpression: "contains (tags, :t)",
      ExpressionAttributeValues: {
        ":u": req.user.sub,
        ":t": req.params.tag,
      },
      ScanIndexForward: false,
    };
    const docClient = new AWS.DynamoDB.DocumentClient();
    docClient.query(params, (err, data) => {
      if (err) res.status(400).json(err);
      else res.json(data);
    });
  });

module.exports = router;
