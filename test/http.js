const chai = require('./chai.js')
const ERR = require('../src/error/dfn.json')
const expect = chai.expect
const request = require('supertest')
const path = require('path')
const fs = require('fs')
const validHTML = fs.readFileSync(
    path.resolve(__dirname, '../cases/0.html'),
    'utf8')
const emptyHTML = '<html></html>'

describe('http', function () {
  var server
  beforeEach(function () {
    server = require('../src/http.js')()
  })
  afterEach(function () {
    server.close()
  })

  describe('/', function () {
    it('responds with Usage', function (done) {
      request(server)
      .get('/')
      .expect(200)
      .expect(/Usage/, done)
    })
  })

  describe('/foo', function () {
    it('responds /foo with 404', function (done) {
      request(server)
      .get('/foo')
      .expect(404, done)
    })
  })

  describe('/validate', function () {
    it('responds [] for valid html', function (done) {
      request(server)
      .post('/validate')
      .send(validHTML)
      .expect(200, '[]', done)
    })

    it('responds [xxx] for invalid html', function (done) {
      request(server)
      .post('/validate')
      .send(emptyHTML)
      .expect(200)
      .expect(function (res) {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.length.above(0)
      })
      .end(done)
    })

    it('should respect rules config', function (done) {
      var customServer = require('../src/http')({body: {mandatory: true}})
      request(customServer)
      .post('/validate')
      .send(emptyHTML)
      .expect(200)
      .expect(function (res) {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
        expect(res.body[0].code).to.equal(ERR.MANDATORY_TAG_MISSING.code)
      })
      .end(done)
    })
  })

  describe('/validate?fast=true', function () {
    it('reponds [] for valid html', function (done) {
      request(server)
      .post('/validate?fast=true')
      .send(validHTML)
      .expect(200, '[]', done)
    })

    it('responds a single error for invalid html', function (done) {
      request(server)
      .post('/validate?fast=true')
      .send(emptyHTML)
      .expect(200)
      .expect(function (res) {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf(1)
      })
      .end(done)
    })

    it('reponds multiple errors when fast=false', function (done) {
      request(server)
      .post('/validate?fast=false')
      .send(emptyHTML)
      .expect(200)
      .expect(function (res) {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.length.above(1)
      })
      .end(done)
    })
  })
})
