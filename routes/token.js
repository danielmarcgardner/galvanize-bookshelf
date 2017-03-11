'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const app = express();
const router = express.Router();
const knex = require('../knex.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-as-promised')
const humps = require('humps');
const cookieParser = require('cookie-parser')
app.use(cookieParser())

router.get('/token', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        res.set("Content-Type", "application/json");
        res.status(200).send(false);
      }
      else{
        res.status(200).send(true);
      }
    });
  })

router.post('/token', (req, res) => {
  if (!req.body.email) {
    res.set("Content-Type", "text/plain");
    return res.status(400).send('Email must not be blank')
  }
  if (!req.body.password) {
    res.set("Content-Type", "text/plain");
    return res.status(400).send('Password must not be blank')
  }
      knex('users').select('hashed_password', 'id').where('email', req.body.email)
        .then((toCompare) => {
          if (toCompare.length === 0) {
            res.set("Content-Type", "text/plain");
            return res.status(400).send('Bad email or password')
          }
          let compare = toCompare[0].hashed_password;
          let userID = toCompare[0].id
          bcrypt.compare(req.body.password, compare)
            .then((userAuth) => {
              const user = { user_id: userID };
              const token = jwt.sign(user, process.env.JWT_KEY, {
                expiresIn: '7 days'
              })
              res.cookie('token', token, {
                httpOnly: true
              })
              return knex('users').where('email', req.body.email)
            })
            .then((users) => {
              let userToSend = users[0];
                delete userToSend.hashed_password;
                delete userToSend.created_at;
                delete userToSend.updated_at;
                res.status(200).json(humps.camelizeKeys(userToSend))
            })

            .catch((badPass) => {
              res.set("Content-Type", "text/plain");
              return res.status(400).send('Bad email or password')
            })
        })

})

router.delete('/token', (req, res) => {
  res.clearCookie('token')
  res.send(true)
})

module.exports = router;
