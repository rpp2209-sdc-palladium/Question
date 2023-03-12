-- Create the databases
CREATE DATABASE qa;

-- Create 3 tables, question/answer/photos
-- CREATE TABLE IF NOT EXISTS question(
--   question_id INT PRIMARY KEY,
--   question_body TEXT,
--   question_date TEXT,
--   email TEXT,
--   asker_name TEXT,
--   question_helpfulness INT,
--   reported boolean,
--   product_id INT
-- );

-- CREATE TABLE IF NOT EXISTS answer(
--   answer_id INT PRIMARY KEY,
--   answer_body TEXT,
--   answer_date TEXT,
--   answerer_name TEXT,
--   answer_helpfulness INT,
--   question_id INT,
--   CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS photos(
--   photo_id INT PRIMARY KEY,
--   url TEXT,
--   answer_id INT
--   CONSTRAINT fk_answer FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE
-- );