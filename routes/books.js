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

router.get('/books/:id', (req, res, next) => {
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
  knex('books').where('id', id)
  .then((books) => {
    let booksItem = books[0]
    res.status(200).json(booksItem);
    // knex.destroy();
    })
  })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/books', (req, res) => {
if (!req.body.title) {
  return res.status(400).send('Title must not be blank')
}
if (!req.body.author) {
  return res.status(400).send('Author must not be blank')
}
if (!req.body.genre) {
  return res.status(400).send('Genre must not be blank')
}
if (!req.body.description) {
  return res.status(400).send('Description must not be blank')
}
if (!req.body.cover_url) {
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
        res.status(200).json(booksItem);
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
    next()
  }
  knex('books').max('id')
  .then((largestId) => {
    let largest = largestId[0].max
    console.log(largest)
    if (id < 0 || id > largest) {
      next()
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
      res.status(200).json(singleBook)
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
      res.status(200).json(deletedBook)
})
    })
  })
  .catch((err) => {
    console.log(err);
  })
})

router.use((req, res) => {
    return res.sendStatus(404);
});

module.exports = router;
