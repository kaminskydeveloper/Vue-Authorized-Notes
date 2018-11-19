const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const db = require("../db/connection");
const users = db.get("users");
// users.index("username");
users.createIndex("username", { unique: true });

const router = express.Router();

//ANY ROUTE IN HERE /auth

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]*$)/)
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .min(10)
    .required()
});

router.get("/", (req, res) => {
  res.json({
    message: "🏸"
  });
});

router.post("/signup", (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    //make sure username is unique
    users
      .findOne({
        username: req.body.username
      })
      .then(user => {
        //if user is undifinder, username is not in the db, otherwise duplicate user detected
        if (user) {
          // there is already user in the db with that username
          //respond with an error!

          const error = new Error(
            "Username already exists! Please choose another one."
          );
          next(error);
        } else {
          //hash the password
          //insert the user with the hashed password
          bcrypt.hash(req.body.password, 12).then(hashedPassword => {
            //insert the user with hashed password
            const newUser = {
              username: req.body.username,
              password: hashedPassword
            };

            users.insert(newUser).then(insertedUser => {
              res.json(insertedUser);
            });
          });
        }
      });
  } else {
    next(result.error);
  }
});

module.exports = router;
