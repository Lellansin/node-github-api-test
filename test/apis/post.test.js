'use strict';

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const app = require('../../src/app').listen();
const request = require('supertest-as-promised')(app);
const should = require('chai').should();

chai.use(chaiAsPromised);

describe('Post API', function() {
  it('return post list when fetch posts', function() {
    return request
    .get('/v1/posts')
    .then(res => res.body.should.be.an('array'));
  })
})
