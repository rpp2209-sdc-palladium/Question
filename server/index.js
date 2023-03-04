const path = require('path');
// Bringing in the express framework and storing it in a constant.
const express = require('express');
// Initializing the express framework and saving it into another constant called app
const app = express();
const port = 3000;
const postgreSQLDB = require('../db/postgreSQL.js');

// basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
