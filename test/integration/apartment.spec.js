/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('apartments', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('post /apartments', () => {
    it('should create an apartment', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a1', sqrft: 1000, bedrooms: 2,
              floor: 2, rent: 1400 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.name).to.equal('a1');
        done();
      });
    });

    it('should not create an apartment, given no name', (done) => {
      request(app)
      .post('/apartments')
      .send({ sqrft: 1000, bedrooms: 2,
              floor: 2, rent: 1400 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });

    it('should not create an apartment, given negative sqrft', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a4', sqrft: -1000, bedrooms: 2,
              floor: 2, rent: 1400 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"sqrft" must be larger than or equal to 1']);
        done();
      });
    });

    it('should not create an apartment, given bad floor', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a4', sqrft: 1000, bedrooms: 2,
              floor: 'two', rent: 1400 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"floor" must be a number']);
        done();
      });
    });
  });

  describe('get /apartments', () => {
    it('should show all the apartments', (done) => {
      request(app)
      .get('/apartments')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(3);
        done();
      });
    });

    it('should filter apartments by bedrooms', (done) => {
      request(app)
      .get('/apartments?filter[bedrooms][$eq]=3')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(1);
        expect(rsp.body.apartments[0].name).to.equal('a1');
        done();
      });
    });

    it('should filter apartments by sqrft', (done) => {
      request(app)
      .get('/apartments?filter[sqrft][$gte]=1000')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(2);
        done();
      });
    });

    it('should filter apartments by floor', (done) => {
      request(app)
      .get('/apartments?filter[floor][$gte]=2')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(2);
        done();
      });
    });

    it('should filter apartments by EVERYTHING', (done) => {
      request(app)
      .get('/apartments?filter[rent][$lte]=2900&filter[bedrooms][$gte]=2&sort[name]=1&page=2&limit=1')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(1);
        expect(rsp.body.apartments[0].name).to.equal('a3');
        done();
      });
    });

    it('should find all vacant apartments', (done) => {
      request(app)
      .get('/apartments?filter[renter][$eq]=vacant')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(3);
        done();
      });
    });

    it('should find all occupied apartments', (done) => {
      request(app)
      .get('/apartments?filter[renter][$ne]=vacant')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(0);
        done();
      });
    });
  });

  describe('get /apartments/:id', () => {
    it('should show the desired apartment', (done) => {
      request(app)
      .get('/apartments/012345678901234567890001')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.name).to.equal('a1');
        done();
      });
    });

    it('should have an error if the apartment does not exist', (done) => {
      request(app)
      .get('/apartments/012345678901234567890099')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.equal('yo apartment does not exist!');
        done();
      });
    });

    it('should have an error if the id in the url is not valid', (done) => {
      request(app)
      .get('/apartments/cowmoo')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "cowmoo" fails to match the required pattern');
        done();
      });
    });
  });

  describe('delete /apartments/:id', () => {
    it('should delete the desired apartment', (done) => {
      request(app)
      .delete('/apartments/012345678901234567890001')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.name).to.equal('a1');
        done();
      });
    });

    it('should have an error if the apartment does not exist', (done) => {
      request(app)
      .delete('/apartments/012345678901234567890099')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.equal('yo apartment does not exist!');
        done();
      });
    });

    it('should have an error if the id in the url is not valid', (done) => {
      request(app)
      .delete('/apartments/cowmoo')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "cowmoo" fails to match the required pattern');
        done();
      });
    });
  });

  describe('put /apartments/:id', () => {
    it('should update the desired apartment', (done) => {
      request(app)
      .put('/apartments/012345678901234567890001')
      .send({ name: 'a1', sqrft: 200000, floor: 30, rent: 4000, bedrooms: 5 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.rent).to.equal(4000);
        expect(rsp.body.apartment.bedrooms).to.equal(5);
        done();
      });
    });

    it('should have an error if the apartment does not exist', (done) => {
      request(app)
      .put('/apartments/012345678901234567890099')
      .send({ name: 'a1', sqrft: 200000, floor: 30, rent: 4000, bedrooms: 5 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.equal('That is not a valid apartment!!!');
        done();
      });
    });

    it('should have an error if the id in the url is not valid', (done) => {
      request(app)
      .put('/apartments/cowmoo')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "cowmoo" fails to match the required pattern');
        done();
      });
    });

    it('should have an error given bad data', (done) => {
      request(app)
      .put('/apartments/012345678901234567890001')
      .send({ name: 'a4', sqrft: 1000, bedrooms: 2,
              floor: 7, rent: 'so much money' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"rent" must be a number']);
        done();
      });
    });
  });
});
