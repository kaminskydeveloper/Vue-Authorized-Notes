const express = require('express');
const Joi = require('joi');
const db = require('../db/connection');
const notes = db.get('notes');

const schema = Joi.object().keys({
  title: Joi.string()
    .trim()
    .max(100)
    .required(),
  note: Joi.string()
    .trim()
    .min(10)
    .required(),
});

const router = express.Router();

router.get('/', (req, res) => {
  notes
    .find({
      user_id: req.user._id,
    })
    .then(notes => {
      res.json(notes);
    });
});

//NOTE VALIDATION
router.post('/', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    //add id to note for specify individual note
    const note = {
      ...req.body,
      user_id: req.user._id,
    };
    //insert into db
    notes.insert(note).then(note => {
      res.json(note);
    });
  } else {
    // ERROR
    const error = new Error(result.error);
    res.status(422);
    next(error);
  }
});

module.exports = router;
