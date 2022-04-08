const { Router } = require('express');
const Quote = require('../services/Quote');

module.exports = Router().get('/', async (req, res, next) => {
  Quote.getAll()
    .then((quote) => res.send(quote))
    .catch((error) => next(error));
});
