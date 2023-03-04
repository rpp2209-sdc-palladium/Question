const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const connectDb = async () => {
  try {
    const client = new Client({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    })

    await client.connect()

    // Create the database
      // do it in the terminal
      // Then switch to the database called 'qa'

    // Create table question
    await client.query('CREATE TABLE IF NOT EXISTS question(\
      question_id INT PRIMARY KEY,\
      question_body TEXT,\
      question_date TEXT,\
      asker_email TEXT,\
      asker_name TEXT,\
      question_helpfulness INT,\
      reported BOOLEAN,\
      product_id INT\
    )');

    // Create table answer
    await client.query('CREATE TABLE IF NOT EXISTS answer(\
      answer_id INT PRIMARY KEY,\
      answer_body TEXT,\
      answer_date TEXT,\
      answerer_name TEXT,\
      answerer_email TEXT,\
      answer_helpfulness INT,\
      reported BOOLEAN, \
      question_id INT\
    )');

    // Create table photos
    await client.query('CREATE TABLE IF NOT EXISTS photos(\
      photo_id INT PRIMARY KEY,\
      url TEXT,\
      answer_id INT\
    )');

    console.log('Connected to PostgreSQL');
    await client.end()
  } catch (error) {
    console.log('Failed connection to PostgreSQL', error);
  }
}

connectDb();