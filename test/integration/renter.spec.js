/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('renter', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('post /renters', () => {
    it('should create a renter', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'Billy Joel', money: 1000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.name).to.equal('Billy Joel');
        expect(rsp.body.renter.money).to.equal(1000);
        done();
      });
    });
    it('should not create a renter, given no name', (done) => {
      request(app)
      .post('/renters')
      .send({ money: 20 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });

    it('should not create an renter, negative money', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'Tiffany Rocks', money: -1000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"money" must be larger than or equal to 0']);
        done();
      });
    });

    it('should not create an renter, given a string for money', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'Tiffany is Awesome', money: 'broke' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"money" must be a number']);
        done();
      });
    });
  });

  describe('get /renters', () => {
    it('should show all the renters', (done) => {
      request(app)
      .get('/renters')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(3);
        done();
      });
    });
    it('should filter renters by money', (done) => {
      request(app)
      .get('/renters?filter[money][$gte]=500')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters.length).to.equal(2);
        done();
      });
    });
    it('should filter renters BY EVERYTHING', (done) => {
      request(app)
      .get('/renters?filter[money][$gte]=500&sort[name]=1&page=2&limit=1')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters[0].name).to.equal('Tiffany Rocks');
        done();
      });
    });
  });

  describe('delete /renters/:id', () => {
    it('should delete the renter specified in the url', (done) => {
      request(app)
      .delete('/renters/012345678901234567890129')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.name).to.equal('Billy Joel');
        done();
      });
    });
    it('should throw an error if a bad url is given', (done) => {
      request(app)
      .delete('/renters/cowmoo')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('"id" with value "cowmoo" fails to match the required pattern: /^[0-9a-f]{24}$/');
        done();
      });
    });
  });
});
