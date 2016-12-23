const chai = require('./chai.js');
const expect = chai.expect;
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const validHTML = fs.readFileSync(
    path.resolve(__dirname, '../cases/0.html'),
    'utf8');
const invalidHTML = '<html></html>';

describe('http', function() {
    var server;
    beforeEach(function() {
        server = require('../bin/http.js');
    });
    afterEach(function() {
        server.close();
    });

    describe('/', function() {
        it('responds with Usage', function(done) {
            request(server)
                .get('/')
                .expect(200)
                .expect(/Usage/, done);
        });
    });

    describe('/validate', function() {
        it('responds [] for valid html', function(done) {
            request(server)
                .post('/validate')
                .send(validHTML)
                .expect(200, '[]', done);
        });

        it('responds [xxx] for invalid html', function(done) {
            request(server)
                .post('/validate')
                .send(invalidHTML)
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length.above(0);
                })
                .end(done);
        });
    });

    describe('/validate?fast=true', function() {
        it('reponds [] for valid html', function(done) {
            request(server)
                .post('/validate?fast=true')
                .send(validHTML)
                .expect(200, '[]', done);
        });

        it('responds a single error for invalid html', function(done) {
            request(server)
                .post('/validate?fast=true')
                .send(invalidHTML)
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);
                })
                .end(done);
        });

        it('reponds multiple errors when fast=false', function(done) {
            request(server)
                .post('/validate?fast=false')
                .send(invalidHTML)
                .expect(200)
                .expect(function(res) {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length.above(1);
                })
                .end(done);
        });
    });
});
