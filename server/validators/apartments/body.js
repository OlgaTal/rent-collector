/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  name: joi.string().required(),
  sqrft: joi.number().required().min(1),
  bedrooms: joi.number().required().min(0),
  floor: joi.number().required(),
  rent: joi.number().required().min(0),
  renter: joi.object(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    next();
  }
};
