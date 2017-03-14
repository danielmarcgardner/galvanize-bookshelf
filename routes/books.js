'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js')
const humps = require('humps');
const ev = require('express-validation');
const validations = require('../validations/books.js');

router.get('/books', (req, res) => {
  knex('books').orderBy('title', 'asc')
  .then((books) => {
    res.status(200).json(humps.camelizeKeys(books));
    // knex.destroy();
  })
  .catch((err) => {
    console.log(err)
  })
});

router.get('/books/:id', (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.sendStatus(404);
  }
  knex('books').max('id')
  .then((largestId) => {
    let largest = largestId[0].max
    if (id < 0 || id > largest) {
      return res.sendStatus(404);
    }
    return knex('books').where('id', id)
    })
  .then((books) => {
    let booksItem = books[0]
    res.status(200).json(humps.camelizeKeys(booksItem));
    // knex.destroy();
    })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/books', ev(validations.post), (req, res) => {
  let newBook = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url,
    created_at: new Date(),
    updated_at: new Date()
  }
    knex('books').insert(newBook)
      .then((result) => {
        return knex('books').where('title', newBook.title)
      })
      .then((b) => {
          let booksItem = b[0];
          res.status(200).json(humps.camelizeKeys(booksItem));
      })
      .catch((err) => {
        console.log(err)
      })
})

router.patch('/books/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const bookUpdate = req.body;
  const updated_at = new Date();
  if (isNaN(id)) {
    return res.sendStatus(404);
  }
  knex('books').max('id')
  .then((largestId) => {
    let largest = largestId[0].max
    console.log(largest)
    if (id < 0 || id > largest) {
      return res.sendStatus(404);
    }
      return knex('books').where('id', id).update(bookUpdate)
    })
    .then((result) => {
      return knex('books'). where('id', id).update('updated_at', updated_at)
    })
    .then((updated) => {
      return knex('books').where('id', id)
    })
    .then((updatedBook) => {
      let singleBook = updatedBook[0];
      res.status(200).json(humps.camelizeKeys(singleBook))
    })
    .catch((err) => {
      console.log(err);
    })
})

router.delete('/books/:id', (req, res, next) => {
  const id = Number(req.params.id);
  knex('books').max('id')
    .then((largestId) => {
      let largest = largestId[0].max
      console.log(largest)
      if (id < 0 || id > largest) {
        next()
      }
      return knex('books').select('author', 'cover_url', 'description', 'genre', 'title').where('id', id)
    })
    .then((deleted) => {
      knex('books').where('id', id).del()
      let deletedBook = deleted[0]
      return deletedBook
    })
    .then((deleteB) => {
      res.status(200).json(humps.camelizeKeys(deleteB))
      })
    .catch((err) => {
      console.log(err);
    })
})

module.exports = router;
