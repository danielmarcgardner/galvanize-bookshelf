'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js')
const humps = require('humps');

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
    console.log(largest)
    if (id < 0 || id > largest) {
      return res.sendStatus(404);
    }
  knex('books').where('id', id)
  .then((books) => {
    let booksItem = books[0]
    res.status(200).json(humps.camelizeKeys(booksItem));
    // knex.destroy();
    })
  })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/books', (req, res) => {
if (!req.body.title) {
  res.set("Content-Type", "text/plain");
  return res.status(400).send('Title must not be blank')
}
if (!req.body.author) {
  res.set("Content-Type", "text/plain");
  return res.status(400).send('Author must not be blank')
}
if (!req.body.genre) {
  res.set("Content-Type", "text/plain");
  return res.status(400).send('Genre must not be blank')
}
if (!req.body.description) {
  res.set("Content-Type", "text/plain");
  return res.status(400).send('Description must not be blank')
}
if (!req.body.cover_url) {
  res.set("Content-Type", "text/plain");
  return res.status(400).send('Cover URL must not be blank')
}

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
        res.status(200).json(humps.camelizeKeys(booksItem));
      })
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
  knex('books').where('id', id)
    .update(bookUpdate)
    .then((result) => {
      knex('books'). where('id', id)
      .update('updated_at', updated_at)
      .then((updated) => {
        knex('books').where('id', id)
        .then((updatedBook) => {
      let singleBook = updatedBook[0];
      res.status(200).json(humps.camelizeKeys(singleBook))
    })
      })
      })
    })
    .catch((err) => {
      console.log(err);
    })
})

router.delete('/books/:id', (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    next()
  }
  knex('books').max('id')
  .then((largestId) => {
    let largest = largestId[0].max
    console.log(largest)
    if (id < 0 || id > largest) {
      next()
    }
  knex('books').select('author', 'cover_url', 'description', 'genre', 'title').where('id', id)
  .then((deleted) => {
    let deletedBook = deleted[0]
    knex('books').where('id', id).del()
    .then((result) => {
      res.status(200).json(humps.camelizeKeys(deletedBook))
})
    })
  })
  .catch((err) => {
    console.log(err);
  })
})

module.exports = router;
