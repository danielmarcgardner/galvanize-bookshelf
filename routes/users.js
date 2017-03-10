'use strict';

const express = require('express');
const bcrypt = require('bcrypt-as-promised')
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js')
const humps = require('humps');
const jwt = require('jsonwebtoken')

router.post('/users', (req, res) => {
  if (!req.body.email) {
    res.set("Content-Type", "text/plain");
    return res.status(400).send('Email must not be blank')
  }
  if (!req.body.password) {
    res.set("Content-Type", "text/plain");
    return res.status(400).send('Password must be at least 8 characters long')
  }
knex('users').where('email', req.body.email)
  .then((checkingEmail) => {
    if (checkingEmail.length > 0) {
      res.set("Content-Type", "text/plain");
      return res.status(400).send('Email already exists')
    }
  })

  bcrypt.hash(req.body.password, 11)
      .then((hashed_pass) => {
        const newUser = {
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hashed_pass
        }
        const user = { user_id: req.body.email };
        const token = jwt.sign(user, process.env.JWT_KEY, {
            expiresIn: '7 days'
        })
        res.cookie('token', token, {
            httpOnly: true
            // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            // secure: router.get('env') === 'production'
        })
          knex('users').insert(newUser, '*')
            .then((userSend) => {
              let user = userSend[0]
              delete user.hashed_password;
              delete user.created_at;
              delete user.updated_at;
              res.status(200).json(humps.camelizeKeys(user))
            })
          })
      .catch((err) => {
        console.log(err);
      });
})

module.exports = router;
