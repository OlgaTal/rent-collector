/* eslint-disable new-cap, array-callback-return, no-console */

import express from 'express';
import Apartment from '../models/apartment';
import bodyValidator from '../validators/apartments/body';
import paramsValidator from '../validators/apartments/params';
import queryValidator from '../validators/apartments/query';
const router = module.exports = express.Router();

router.post('/', bodyValidator, (req, res) => {
  Apartment.create(res.locals, (err, apartment) => {
    res.send({ apartment });
  });
});

router.get('/', queryValidator, (req, res) => {
  Apartment.find(res.locals.filter)
            .sort(res.locals.sort)
            .limit(res.locals.limit)
            .skip(res.locals.skip)
            .exec((err, apartments) => {
              res.send({ apartments });
            });
});

router.get('/:id', paramsValidator, (req, res) => {
  Apartment.findById(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: 'yo apartment does not exist!' });
    }
  });
});

router.delete('/:id', paramsValidator, (req, res) => {
  Apartment.findByIdAndRemove(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: 'yo apartment does not exist!' });
    }
  });
});

router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  Apartment.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, apartment) => {
    if (apartment) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: 'That is not a valid apartment!!!' });
    }
  });
});
