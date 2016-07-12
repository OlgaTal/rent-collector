/* eslint-disable new-cap, array-callback-return, no-console */

import express from 'express';
import Renter from '../models/renter';
import bodyValidator from '../validators/renters/body';
import queryValidator from '../validators/renters/query';
import paramsValidator from '../validators/renters/params';

const router = module.exports = express.Router();

router.post('/', bodyValidator, (req, res) => {
  Renter.create(res.locals, (err, renter) => {
    res.send({ renter });
  });
});

router.get('/', queryValidator, (req, res) => {
  Renter.find(res.locals.filter)
        .sort(res.locals.sort)
        .limit(res.locals.limit)
        .skip(res.locals.skip)
        .exec((err, renters) => {
          res.send({ renters });
        });
});


router.delete('/:id', paramsValidator, (req, res) => {
  Renter.findByIdAndRemove(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ renter });
    } else {
      res.status(400).send({ messages: 'yo renter does not exist!' });
    }
  });
});
