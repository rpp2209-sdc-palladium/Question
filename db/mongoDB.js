const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:3000');

// Define the questionsAndAnswers schema
const questionsMongoSchema = new mongoose.Schema({
  product_id: Number,
  results: [{
    question_id: Number,
    question_body: String,
    question_date: String,
    asker_name: String,
    question_helpfulness: Number,
    reported: Boolean,
    answers: {
      // dynamic Id, need fix?
      dynamicID: {
        {
        answer_id: Number,
        body: String,
        date: String,
        answerer_name: String,
        helpfulness: Number,
        photos: [{
          id: Number,
          url: String
        }]
        }
      }
    }
  }]
});

const questions = mongoose.model('Questions', questionsMongoSchema);