'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const env = process.env.node_env || 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

router.get('/books', (req, res) => {
  knex('books').orderBy('title', 'asc')
  .then((books) => {
    res.status(200).json(books);
    // knex.destroy();
  })
  .catch((err) => {
    console.log(err)
  })
});

router.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  knex('books').where('id', id)
  .then((books) => {
    let booksItem = books[0];
    res.status(200).json(booksItem);
    // knex.destroy();
  })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/books', (req, res) => {
let newBook ={
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
      knex('books')
      .where('title', newBook.title)
      .then((b) => {
        let booksItem = b[0];
        res.status(200).json(booksItem);
      })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.patch('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const bookUpdate = req.body;
  const updated_at = new Date();

  knex('books').where('id', id)
    .update(bookUpdate)
    .then((result) => {
      knex('books'). where('id', id)
      .update('updated_at', updated_at)
      .then((updated) => {
        knex('books').where('id', id)
        .then((updatedBook) => {
      let singleBook = updatedBook[0];
      res.status(200).json(singleBook)
      })
      })
    })
    .catch((err) => {
      console.log(err);
    })
})

router.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  knex('books').select('author', 'cover_url', 'description', 'genre', 'title').where('id', id)
  .then((deleted) => {
    let deletedBook = deleted[0]
    knex('books').where('id', id).del()
    .then((result) => {
      res.status(200).json(deletedBook)
    })
  })
  .catch((err) => {
    console.log(err);
  })
})

module.exports = router;
