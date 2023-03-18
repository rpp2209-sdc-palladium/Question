const path = require('path');
// Bringing in the express framework and storing it in a constant.
const express = require('express');
// Initializing the express framework and saving it into another constant called app
const app = express();
const port = 3000;
// Import the database
const db = require('../db/postgreSQL.js').client;

// basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Retrieves a list of questions for a particular product.
app.get('/qa/questions', (req, res) => {
  res.send('Retrieve a list of questions');
  // answer_id, answer_body, answer_date, answerer_name, answerer_email, answer.reported, answer_helpfulness
  // db.query(`SELECT q.question_id, question_body, question_date, asker_name, asker_email, q.reported,
  // question_helpfulness, count(*) as answers_count, array_agg(answer_id) as answers
  // FROM (select * from question where product_id = 5) q
  // LEFT JOIN answer ON q.question_id = answer.question_id
  // GROUP BY q.question_id, question_body, question_date, asker_name, asker_email, q.reported,
  // question_helpfulness;`, (err, result) => {
  //   if (err) {
  //     console.log('err', err);
  //     res.status(404).send(err);
  //   } else {
  //     // console.log('testing', result.rows);
  //     res.send({ 'product_id': 5, 'results': result.rows });
  //   }
  // })
})

// Returns answers for a given question_id
app.get('/qa/questions/:question_id/answers', (req, res)=> {
  res.send('Returns answers for a given question');
})

// Adds a question for the given product
app.post('/qa/questions', (req, res)=>{
  res.send('Add a question');
})

// Adds an answer for the given question
app.post('/qa/questions/:question_id/answers', (req, res)=> {
  res.send('Add an answer');
})

// Mark question as helpful
// Updates a question to show it was found helpful.
app.put('/qa/questions/:question_id/helpful', (req, res)=> {
  res.send('Mark question as helpful');
})

// Report question
// Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.
app.put('/qa/questions/:question_id/report', (req, res)=> {
  res.send('Report question');
})

// Mark Answer as Helpful
// Updates an answer to show it was found helpful.
app.put('/qa/answers/:answer_id/helpful', (req, res)=> {
  res.send('Mark answers as helpful');
})

// Report Answer
// Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.
app.put('/qa/answers/:answer_id/report', (req, res)=> {
  res.send('Report the answer');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
