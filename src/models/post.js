'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postSchema = new Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  active: {
    type: Boolean
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
