const pool = require('../utils/pool');

module.exports = class Post {
  id;
  content;
  userId;

  constructor(row) {
    this.id = row.id;
    this.content = row.content;
    this.userId = row.user_id;
  }

  static create({ content, id }) {
    return pool
      .query(
        `
            INSERT INTO
              posts (content, user_id)
            VALUES
              ($1, $2)
            RETURNING
              *
            `,
        [content, id]
      )
      .then(({ rows }) => new Post(rows[0]));
  }

  static findAll() {
    return pool
      .query('SELECT * FROM posts')
      .then(({ rows }) => rows.map((row) => new Post(row)));
  }
};
