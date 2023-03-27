import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import option from './options.js';

export const options = option;

export default function () {
  // max answer Id is 6879374, take the last 10% of numbers
  var randomAnswerId = randomIntBetween(6879374 * 0.9, 3518963);
  http.put(`http://localhost:8080/qa/questions/${randomAnswerId}/report`);
}