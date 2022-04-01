const { Router } = require('express');

module.exports = Router().get('/', async (req, res) => {
  console.log('hello');
  res.send('hello world');
});
