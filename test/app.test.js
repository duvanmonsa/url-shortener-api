const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");

const urls = require('./dummy/urls');

const { expect } = chai;
chai.use(chaiHttp);
describe("Server!", () => {
  it("welcomes user to the api", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals("success");
        expect(res.body.message).to.equals("Welcome To SkillShare API");
        done();
      });
  });

  it("should fail if not urls provide", done => {
    chai
      .request(app)
      .post("/")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.status).to.equals("error");
        expect(res.body.result).to.equals("You need to provide at least one url");
        done();
      });
  });

  let hash;

  it("should success with urls", done => {
    chai
      .request(app)
      .post("/")
      .send({ urls })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.equals(2);
        expect(res.body[0].original_url).to.equals(urls[0]);
        // save one hash to test the redirect endpoint
        hash = res.body[0].hash;
        expect(res.body[0].hash).to.not.be.equals(null);
        done();
      });
  });

  it("should fail if hash doesn't exist", done => {
    chai
      .request(app)
      .get("/notExist")
      .send()
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.status).to.equals("error");
        expect(res.body.result).to.equals("The hash does not exist");
        done();
      });
  });

  it("should success redirect with one hash", done => {
    chai
      .request(app)
      .get(`/${hash}`)
      .redirects(0)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(302);
        expect(res.get('location')).to.equals(urls[0]);
        done();
      });
  });
});