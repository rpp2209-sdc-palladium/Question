import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import option from './options.js';

export const options = option;

// https://k6.io/docs/using-k6/http-requests/

export default function () {
  // max question Id is 3518963, take the last 10% of numbers
  var randomQuestionId = randomIntBetween(3518963 * 0.9, 3518963);
  const url = `http://localhost:8080/qa/questions/${randomQuestionId}/answers`;
  const payload = JSON.stringify({
    body: 'It is a great product',
    name: 'jason',
    email: 'jason@gmail.com',
    photos: ['url1', 'url2']
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
