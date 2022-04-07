const { Router } = require('express');
const { sign } = require('../utils/jwt');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', (req, res, next) => {
    let profile;
    return exchangeCodeForToken(req.query.code)
      .then((token) => getGithubProfile(token))
      .then(({ username, avatar_url, email }) => {
        profile = { username, avatar_url, email };
        return GithubUser.findByUsername(profile.username);
      })
      .then((user) => {
        if (!user) {
          return GithubUser.create(profile);
        } else {
          return user;
        }
      })
      .then((user) => {
        res
          .cookie(process.env.COOKIE_NAME, sign(user), {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .redirect('/api/v1/posts');
      })
      .catch((error) => next(error));
  })
  .delete('/logout', (req, res) => {
    res.clearCookie(process.env_COOKIE_NAME).json({ message: 'Logged Out' });
  });
