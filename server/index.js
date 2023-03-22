const path = require('path');
// Bringing in the express framework and storing it in a constant.
const express = require('express');
// Initializing the express framework and saving it into another constant called app
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
// Import the database
const db = require('../db/postgreSQL.js').client;

// basic middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Retrieves a list of questions for a particular product. This list does not include any reported questions.
// Parameters:
  // product_id: Specifies the product for which to retrieve questions.
  // page: Selects the page of results to return. Default 1.
  // count: Specifies how many results per page to return. Default 5.
app.get('/qa/questions', (req, res) => {
  // res.send('Retrieve a list of questions');
  var product_id = req.query.product_id;
  var page = req.query.page || 1;
  var count = req.query.count || 16;
  var queryString =
    `
  /* Filtered the rows that have the specific product_id, and name the new table as 'q' */
    WITH q AS (
      SELECT *
      FROM question
      WHERE product_id = ${product_id} AND reported = FALSE
    ),
    /* Set up the frame for photos, such as answer_id(ex: 5): [{photo_id: 1, url: 'test1'}, {photo_id:2, url: 'test2'}], and name the new table as 'p' */
    p AS (
      SELECT
        answer_id,
        array_agg(json_build_object('id', photo_id, 'url', url)) as all_photos
      FROM photos
      GROUP BY
        answer_id
    )
    SELECT
      q.question_id,
      question_body,
      question_date,
      asker_name,
      asker_email,
      q.reported,
      question_helpfulness,
      /* If the question does not have any answers, then it displays ' "answers": {} ' */
      CASE
        WHEN bool_and(answer.answer_id IS NULL)
        THEN '{}'
        ELSE
          json_object_agg(
            COALESCE(answer.answer_id, 0),
            json_build_object(
              'id', answer.answer_id,
              'body', answer_body,
              'date',answer_date,
              'answerer_name', answerer_name,
              'helpfulness',answer_helpfulness,
              'photos', COALESCE(p.all_photos, '{}')
            )
          )
      END AS answers
    FROM q
    LEFT JOIN answer ON q.question_id = answer.question_id
    LEFT JOIN p on p.answer_id = answer.answer_id
    GROUP BY
      q.question_id,
      question_body,
      question_date,
      asker_name,
      asker_email,
      q.reported,
      question_helpfulness;
  `;
  db.query(queryString, (err, result) => {
    if (err) {
      console.log('err', err);
      res.status(404).send('Error occurs once retrieve the questions' + err);
    } else {
      res.status(200).send({ 'product_id': product_id, 'results': result.rows });
    }
  });
})

// Returns answers for a given question_id
// Parameters:
  // product_id: Specifies the product for which to retrieve questions. This list does not include any reported answers.
// Query parameters
  // page: Selects the page of results to return. Default 1.
  // count: Specifies how many results per page to return. Default 5.
app.get('/qa/questions/:question_id/answers', (req, res) => {
  // res.send('Returns answers for a given question');
  var question_id = req.params.question_id;
  var page = req.query.page || 1;
  var count = req.query.count || 16;
  var queryString = `
    WITH a AS (
      SELECT answer_id, answer_body as body, answer_date as date, answerer_name, answerer_email, reported, answer_helpfulness as helpfulness
      FROM answer
      WHERE question_id = ${question_id} AND reported = FALSE
    ),
    p AS (
      SELECT
        answer_id,
        array_agg(json_build_object('id', photo_id, 'url', url)) as all_photos
      FROM photos
      GROUP BY
        answer_id
    )
    SELECT a.*,
      CASE
        WHEN p.all_photos IS NULL
        THEN '{}'
        ELSE
          p.all_photos
      END AS photos
    FROM a
    LEFT JOIN p on p.answer_id = a.answer_id
  `;

  db.query(queryString, (err, result) => {
    if (err) {
      res.status(404).send('Error occurs once get the answer' + err);
    } else {
      res.status(200).send({ 'question': question_id, 'page': page, 'count': count, 'results': result.rows });
    }
  });


})

// Adds a question for the given product
// Body parameters: body, name, email, product_id
app.post('/qa/questions', (req, res) => {
  // res.send('Add a question');
  var body = req.body.body;
  var name = req.body.name;
  var email = req.body.email;
  var product_id = req.body.product_id;
  var queryString = `INSERT INTO question (question_body, asker_name, asker_email, product_id) VALUES ($1, $2, $3, $4)`;

  db.query(queryString, [body, name, email, product_id], (err, result) => {
    if (err) {
      res.status(404).send('Error occurs once post the question' + err);
    } else {
      res.sendstatus(201);
    }
  });
})

// Adds an answer for the given question
// Parameter: question_id
// Body parameters: body, name, email, photos
app.post('/qa/questions/:question_id/answers', (req, res) => {
  // res.send('Add an answer');
  var question_id = req.params.question_id;
  var body = req.body.body;
  var name = req.body.name;
  var email = req.body.email;
  var queryAnswerString = `INSERT INTO answer (answer_id, answer_body, answerer_name, answerer_email, question_id) VALUES ($1, $2, $3, $4, $5)`;

  // Find the max answer id at first
  db.query(`SELECT MAX(answer_id) as max_answer_id from answer`, (err, result) => {
    if (err) {
      res.status(404).send('Error occurs once find the max answer_id');
    } else {
      var newMaxAnswerID = result.rows[0].max_answer_id + 1; // Increase the max answer_id by 1
      // Once user trys to add a answer, insert a new rows for answer table
      db.query(queryAnswerString, [newMaxAnswerID, body, name, email, question_id], (err, result) => {
        if (err) {
          res.status(404).send('Error occurs once add the answer' + err);
        } else {
          // Add a new row(s) for photos table
          var photos = req.body.photos;
          if (photos.length > 0) {
            var newPhotoID = 1;
            for (var i = 0; i < photos.length; i++) {
              var eachPhotoUrl = photos[i];
              var queryPhotoString = `INSERT INTO photos (answer_id, photo_id, url) VALUES ($1, $2, $3)`;
              db.query(queryPhotoString, [newMaxAnswerID, newPhotoID, eachPhotoUrl], (err, result) => {
                if (err) {
                  res.status(404).send('Error occurs once add the photos' + err);
                }
              });
              newPhotoID++;
            }
          }
          res.sendStatus(204);
        }
      });
    }
  });
})

// Mark question as helpful
// Updates a question to show it was found helpful.
// Parameters
// question_id
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  var question_id = req.params.question_id;
  // res.send('Mark question as helpful');
  var queryString = `UPDATE question SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${question_id}`;

  db.query(queryString, (err, result) => {
    if (err) {
      res.status(404).send('Error occurs once mark question as helpful' + err);
    } else {
      res.sendStatus(204);
    }
  });
})

// Report question
// Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.
// Parameters
// question_id
app.put('/qa/questions/:question_id/report', (req, res) => {
  // res.send('Report question');
  var question_id = req.params.question_id;
  var queryString = `UPDATE question SET reported = TRUE WHERE question_id = ${question_id}`;

  db.query(queryString, (err, result) => {
    if (err) {
      res.status(404).send('Error occurs once report the question' + err);
    } else {
      res.sendStatus(204);
    }
  });
})

// Mark Answer as Helpful
// Updates an answer to show it was found helpful.
// Parameters
// answer_id
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  // res.send('Mark answers as helpful');
  var answer_id = req.params.answer_id;
  var queryString = `UPDATE answer SET answer_helpfulness = answer_helpfulness + 1 WHERE answer_id = ${answer_id}`;

  db.query(queryString, (err, result) => {
    if (err) {
      res.status(404).send('Error occurs once mark answer as helpful' + err);
    } else {
      res.sendStatus(204);
    }
  });
})

// Report Answer
// Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.
// Parameters
// answer_id
app.put('/qa/answers/:answer_id/report', (req, res) => {
  // res.send('Report the answer');
  var answer_id = req.params.answer_id;
  var queryString = `UPDATE answer SET reported = TRUE WHERE answer_id = ${answer_id}`;

  db.query(queryString, (err, result) => {
    if (err) {
      res.status(404).send('Error occurs once report the answer' + err);
    } else {
      res.sendStatus(204);
    }
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

module.exports = app;