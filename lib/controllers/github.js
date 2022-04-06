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

  .get('/login/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const token = await exchangeCodeForToken(code);
      const { login, avatar_url, email } = await getGithubProfile(token);
      let user = await GithubUser.findByUsername(login);
      if (!user)
        user = await GithubUser.create({
          username: login,
          avatar: avatar_url,
          email,
        });

      res
        .cookie(process.env.COOKIE_NAME, sign(user), {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/posts');
    } catch (error) {
      next(error);
    }
  })

  .delete('/logout', (req, res) => {
    res.clearCookie(process.env_COOKIE_NAME).json({ message: 'Logged Out' });
  });
