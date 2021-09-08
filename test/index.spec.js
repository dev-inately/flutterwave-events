/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const testData = require('./mock.js');

// Configure chai
chai.use(chaiHttp);
chai.should();

const { expect } = chai;

const FlutterwaveEvents = require('..');

const flutterwaveEvents = new FlutterwaveEvents(testData.MOCK_FLUTTER_SECRET_HASH);

function bootStrapApp() {
  const app = express();
  app.use(express.json());
  app.post('/webhook', flutterwaveEvents.webhook());
  app.listen(7339);
  return app;
}

describe('Test Flutterwave Events Middleware', () => {
  before(function () {
    this.app = chai.request(bootStrapApp()).keepOpen();
  });

  it('should not instantiate FlutterwaveEvents without Secret Hash', (done) => {
    expect(FlutterwaveEvents).to.throw('You must supply your `Flutterwave` API key!');
    done();
  });

  it('should return a 400 bad request - No header & body', function (done) {
    this.app
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return a 400 bad request - No webhook body', function (done) {
    this.app
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('x-flutterwave-signature', testData.mockFlutterwaveService())
      .send({})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return a 200 - req body matches encoded header', function (done) {
    this.app
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('x-flutterwave-signature', testData.mockFlutterwaveService())
      .send(testData.sampleWebhookResponse)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  after(function () {
    this.app.close();
  });
});
