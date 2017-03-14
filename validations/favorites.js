'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    bookId: Joi.number()
      .label('bookId')
      .required()
      .greater(0)
    }
}

module.exports.get = {
  query: {
    bookId: Joi.number()
      .label('bookId')
      .required()
      .greater(0)
    }
}

module.exports.delete = {
  body: {
    bookId: Joi.number()
      .label('bookId')
      .required()
      .greater(0)
    }
};
