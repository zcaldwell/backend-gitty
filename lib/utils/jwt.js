const jwt = require('jsonwebtoken');

const sign = (payload) => {
  return jwt.sign({ ...payload }, process.env.JWT_SECRET, {
    expiresIn: '1 day',
  });
};

const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  sign,
  verify,
};
