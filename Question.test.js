const app = require('./server/index.js');
const request = require('supertest');

describe('Question', function () {

  test("Increase value by one", () => {
    var addOne = function (value) {
      return value + 1;
    };
    expect(addOne(1)).toBe(2);
  });
})

describe('GET /hello', () => {
  it('responds with "Hello, world!"', async () => {
    const response = await request(app).get(`/`);
    expect(response.text).toBe('Hello World!');
    expect(response.status).toBe(200);
  });
});

describe('GET answers', () => {
  it('Return the answers info for the given question_id', async () => {
    var question_id = 1;
    const response = await request(app).get(`/qa/questions/${question_id}/answers`);
    const responseBody = JSON.parse(response.text);
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('question', '1');
    expect(responseBody.results[0].answerer_name).toBe('metslover');
  });
});