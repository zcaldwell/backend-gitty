const fetch = require('cross-fetch');

const exchangeCodeForToken = (code) => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT.SECRET;

  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ client_id, client_secret, code }),
  }).then((response) => response.json());
};

const getGithubProfile = (token) => {
  return fetch('https://api.github/user', {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd/github.v3+json',
    },
  }).then((response) => response.json());
};

module.exports = { exchangeCodeForToken, getGithubProfile };
