import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import option from './options.js';

export const options = option;

export default function () {
  // max question Id is 3518963, take the last 10% of numbers
  var randomQuestionId = randomIntBetween(3518963 * 0.9, 3518963);
  http.get(`http://localhost:8080/qa/questions/${randomQuestionId}/answers`);
}