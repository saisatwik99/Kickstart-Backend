const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { describe } = require("mocha");
const server = require("../index.js");
const should = chai.should();
chai.use(chaiHttp);

describe("Companies", function()  {
    this.timeout(0);
    // Get all the Companies
    it("Should Fetch all the Companies", (done) => {
        chai.request(server)
            .get("/admin/company")
            .end((err, res) => {
                res.should.have.status(200);
                // console.log ("Got",res.body.data.length, " docs")
                done()
            });
        // setTimeout(done, 3000);
    })


})