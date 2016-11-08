'use strict';

const postModel = require('../models').Post;

/**
 * fetch posts.
 *
 * @param {number} limit
 * @param {number} offset
 * @return {array} post list
 */
exports.fetchPosts = (limit, offset) => {
  return postModel.find({}).limit(limit).skip(offset);
};


