'use strict'

const express = require('express');
const bcrypt = require('bcrypt-as-promised')
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js')
const humps = require('humps');
const jwt = require('jsonwebtoken')

router.get('/favorites', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set("Content-Type", "application/json");
      res.status(200).send(false);
    }
  // knex('users').select('id').where('email', payload.user_id)
  // .then((userPulled) => {
  //   let idToUse = userPulled[0].id
    // knex('favorites').join('books', 'books.id', '=', 'favorites.book_id')
    // .select('favorites.id', 'book_id', 'user_id', 'books.created_at', 'books.updated_at', 'title', 'author', 'genre', 'description', 'cover_url')
    // .where('favorites.id', idToUse)
    knex('favorites').join('books', 'books.id', '=', 'favorites.book_id').join('users','users.id', '=', 'favorites.user_id' )
    .select('favorites.id', 'book_id', 'user_id', 'books.created_at', 'books.updated_at', 'title', 'author', 'genre', 'description', 'cover_url')
    .where('users.email', payload.user_id)
      .then((carryThrough) => {
        res.status(200).json(humps.camelizeKeys(carryThrough))
      })
    // })
  })
})

router.get('/favorites/check/', (req,res) =>{
  let id = Number(req.query.bookId)
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set("Content-Type", "application/json");
      res.status(200).send(false);
    }
    knex('favorites').join('books', 'books.id', '=', 'favorites.book_id').join('users','users.id', '=', 'favorites.user_id' )
    .select('book_id')
    .where('users.email', payload.user_id).andWhere('book_id', id)
    .then((books) => {
      if (books.length === 0) {
        res.set("Content-Type", "application/json");
        res.status(200).send(false);
      }
      else {
        res.set("Content-Type", "application/json");
        res.status(200).send(true);
      }
    })
})
})
module.exports = router;
