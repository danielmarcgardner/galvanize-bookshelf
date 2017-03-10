'use strict';

const express = require('express');
const bcrypt = require('bcrypt-as-promised')
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js')
const humps = require('humps');


router.post('/users', (req, res) => {
  if (!req.body.email) {
    res.set("Content-Type", "text/plain");
    return res.status(400).send('Email must not be blank')
  }
  if (!req.body.password) {
    res.set("Content-Type", "text/plain");
    return res.status(400).send('Password must be at least 8 characters long')
  }

  bcrypt.hash(req.body.password, 11)
      .then((hashed_pass) => {
        const newUser = {
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hashed_pass
        }
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
