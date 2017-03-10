'use strict';

const express = require('express');
const bcrypt = require('bcrypt-as-promised')
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex.js')
const humps = require('humps');
const jwt = require('jsonwebtoken')

router.get('/favorites', (req, res) =>{

})

module.exports = router;
