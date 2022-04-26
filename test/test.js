const assert = require("assert");
const { describe } = require("mocha");
const server = require("../index.js");
const request = require('supertest');


describe('Trending Posts', function() {
    it('Should fetch posts', function(done) {
        request(server)
        .get('/admin/trending')
        .expect(200, done);
    });
  });



describe('Get Companies', function() {
    it('responds with json', function(done) {
        request(server)
        .get('/admin/company')
        .expect('content-type', /json/)
        .expect(200, done);
    });
  });


 describe('Get CompanyInfo', function() {
    it('Should fetch companyInfo', function(done) {
        request(server)
        .get('/admin/companyInfo')
        .expect(200, done);
    });
  }); 


describe('Wishlist', function() {
    it('Should fetch wishlist', function(done) {
        request(server)
        .get('/admin/wishlist')
        .expect(200, done);
    });
  }); 









