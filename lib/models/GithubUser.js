const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;
  avatar;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }

  static create({ username, email, avatar }) {
    if (!username) throw new Error('Username is required');

    return pool
      .query(
        `
      INSERT INTO users (username, email, avatar)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
        [username, email, avatar]
      )
      .then(({ rows }) => new GithubUser(rows[0]));
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        username=$1
      `,
      [username]
    );

    if (rows.length < 1) return null;
    return new GithubUser(rows[0]);
  }
};
