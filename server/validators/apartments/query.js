
/* eslint-disable consistent-return, no-param-reassign, no-console */

import joi from 'joi';

const schema = {
  page: joi.number().default(1),
  limit: joi.number().default(10),
  filter: joi.object().keys({
    bedrooms: { $eq: joi.number(), $gte: joi.number() },
    sqrft: { $eq: joi.number(), $gte: joi.number() },
    rent: { $eq: joi.number(), $lte: joi.number() },
    renter: joi.string(),
  }),
  sort: joi.object(),
};

module.exports = (req, res, next) => {
  // console.log(' req.query', req.query);
  // if (req.query.filter && req.query.filter.renter && req.query.filter.renter === 'null') {
  //   req.query.filter.renter = null;
  // }
  // console.log('after***', req.query);
  const result = joi.validate(req.query, schema);

  if (result.error) {
    console.log(result.error);
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    res.locals.skip = (res.locals.page - 1) * res.locals.limit;
    next();
  }
};
