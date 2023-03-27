import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import option from './options.js';

export const options = option;

// https://k6.io/docs/using-k6/http-requests/

export default function () {
  // max product Id is 1000011, take the last 10% of numbers
  var randomProductId = randomIntBetween(951672, 1000011);
  const url = 'http://localhost:8080/qa/questions';
  const payload = JSON.stringify({
    body: 'how is the product?',
    name: 'jason',
    email: 'jason@gmail.com',
    product_id: randomProductId
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);
}
