const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

//ANY ROUTE IN HERE /auth

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]*$)/)
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(10)
    .required(),
});

function createTokenSendResponse(user, res, next) {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    {
      expiresIn: '1d',
    },
    (err, token) => {
      if (err) {
        respondError422(res, next);
      } else {
        res.json({
          token,
        });
      }
    }
  );
}

router.get('/', (req, res) => {
  res.json({
    message: '🏸',
  });
});

router.post('/signup', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    //make sure username is unique
    users
      .findOne({
        username: req.body.username,
      })
      .then(user => {
        //if user is undifinder, username is not in the db, otherwise duplicate user detected
        if (user) {
          // there is already user in the db with that username
          //respond with an error!

          const error = new Error(
            'Username already exists! Please choose another one.'
          );
          res.status(409);
          next(error);
        } else {
          //hash the password
          //insert the user with the hashed password
          bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
            //insert the user with hashed password
            const newUser = {
              username: req.body.username,
              password: hashedPassword,
            };

            users.insert(newUser).then(insertedUser => {
              createTokenSendResponse(insertedUser, res, next);
            });
          });
        }
      });
  } else {
    res.status(422);
    next(result.error);
  }
});

function respondError422(res, next) {
  res.status(422);
  const error = new Error('Unable to login.');
  next(error);
}

router.post('/login', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    users
      .findOne({
        username: req.body.username,
      })
      .then(user => {
        if (user) {
          //found the user in the db...
          //now compare the password...

          bcrypt.compare(req.body.password, user.password).then(result => {
            if (result) {
              createTokenSendResponse(user, res, next);
            } else {
              respondError422(res, next);
            }
          });
        } else {
          respondError422(res, next);
        }
      });
  } else {
    respondError422(res, next);
  }
});

module.exports = router;
