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

  static async create({ content, id }) {
    const { rows } = await pool.query(
      `
            INSERT INTO
              posts (content, user_id)
            VALUES
              ($1, $2)
            RETURNING
              *
            `,
      [content, id]
    );
    return new Post(rows[0]);
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows.map((row) => new Post(row));
  }
};
