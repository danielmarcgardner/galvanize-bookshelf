'use strict'

const express = require('express');
const bcrypt = require('bcrypt-as-promised')
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js')
const humps = require('humps');
const jwt = require('jsonwebtoken');

router.get('/favorites', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set("Content-Type", "application/json");
            return res.sendStatus(401)
        }
        knex('favorites').join('books', 'books.id', '=', 'favorites.book_id').join('users', 'users.id', '=', 'favorites.user_id')
            .select('favorites.id', 'book_id', 'user_id', 'books.created_at', 'books.updated_at', 'title', 'author', 'genre', 'description', 'cover_url')
            .where('users.id', payload.user_id)
            .then((carryThrough) => {
                res.status(200).json(humps.camelizeKeys(carryThrough))
            })
    })
})

router.get('/favorites/check/', (req, res) => {
    let id = Number(req.query.bookId)
    if (isNaN(id)) {
      res.set("Content-Type", "text/plain");
      return res.status(400).send('Book ID must be an integer');
    }
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set("Content-Type", "application/json");
            return res.sendStatus(401)
        }
        knex('favorites').join('books', 'books.id', '=', 'favorites.book_id').join('users', 'users.id', '=', 'favorites.user_id')
            .select('book_id')
            .where('users.id', payload.user_id).andWhere('book_id', id)
            .then((books) => {
                if (books.length === 0) {
                    res.set("Content-Type", "application/json");
                    res.status(200).send(false);
                } else {
                    res.set("Content-Type", "application/json");
                    res.status(200).send(true);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

router.post('/favorites', (req, res) => {
    let bookID = Number(req.body.bookId)
    if (isNaN(bookID)) {
      res.set("Content-Type", "text/plain");
      return res.status(400).send('Book ID must be an integer');
    }
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set("Content-Type", "application/json");
            return res.sendStatus(401)
        }
        let newFavBook = {
            book_id: bookID,
            user_id: payload.user_id
        }
        knex('favorites').insert(newFavBook)
            .then((book) => {
                return knex('favorites').where('book_id', bookID).andWhere('user_id', payload.user_id)
            })
            .then((bookToSend) => {
                let newFav = bookToSend[0]
                res.status(200).json(humps.camelizeKeys(newFav))
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

router.delete('/favorites', (req, res) => {
    let bookID = Number(req.body.bookId)
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set("Content-Type", "application/json");
            return res.sendStatus(401)
        }
        knex('favorites').where('book_id', bookID)
            .then((bookToDelete) => {
                knex('favorites').where('book_id', bookID).del()
                let bookDeleted = bookToDelete[0];
                delete bookDeleted.id
                return bookDeleted
            })
            .then((deleteing) => {
                res.status(200).json(humps.camelizeKeys(deleteing))
            })
            .catch((err) => {
                console.log(err)
            })
    })
})

module.exports = router;
