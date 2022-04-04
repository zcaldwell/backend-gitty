-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  github_username TEXT NOT NULL PRIMARY KEY,
  github_photo_url TEXT NOT NULL
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content TEXT NOT NULL,
  user_id BIGINT REFERENCES users(id)
);

INSERT INTO posts (content)
VALUES 
    ('I hope these tests pass'),
    ('Me too ohter post');