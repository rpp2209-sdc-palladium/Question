import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import option from './options.js';

export const options = option;

export default function () {
  // max product Id is 1000011, take the last 10% of numbers
  var randomProductId = randomIntBetween(951672, 1000011);
  http.get(`http://localhost:8080/qa/questions?product_id=${randomProductId}`);
}

