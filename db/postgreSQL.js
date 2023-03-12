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
      product_id INT,\
      question_body TEXT,\
      question_date TEXT,\
      asker_name TEXT,\
      asker_email TEXT,\
      reported BOOLEAN,\
      question_helpfulness INT\
    )');

    // Create table answer
    await client.query('CREATE TABLE IF NOT EXISTS answer(\
      answer_id INT PRIMARY KEY,\
      question_id INT,\
      answer_body TEXT,\
      answer_date TEXT,\
      answerer_name TEXT,\
      answerer_email TEXT,\
      reported BOOLEAN,\
      answer_helpfulness INT,\
      CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE\
    )');

    // Create table photos
    await client.query('CREATE TABLE IF NOT EXISTS photos(\
      photo_id INT PRIMARY KEY,\
      answer_id INT,\
      url TEXT,\
      CONSTRAINT fk_answer FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE\
    )');

    console.log('Connected to PostgreSQL');
    await client.end()
  } catch (error) {
    console.log('Failed connection to PostgreSQL', error);
  }
}

connectDb();