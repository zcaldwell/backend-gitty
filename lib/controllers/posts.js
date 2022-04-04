const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const posts = await Post.findAll();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});
