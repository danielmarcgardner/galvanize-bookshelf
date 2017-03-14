'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    title: Joi.string()
      .label('title')
      .required()
      .trim(),
    author:Joi.string()
      .label('author')
      .required()
      .trim(),
    genre:Joi.string()
      .label('genre')
      .required()
      .trim(),
    description:Joi.string()
      .label('description')
      .required()
      .trim(),
    cover_url:Joi.string()
      .label('cover_url')
      .required()
      .trim()
    }
}
