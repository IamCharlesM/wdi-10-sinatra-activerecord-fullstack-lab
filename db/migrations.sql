CREATE DATABASE item;

\c item

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(32),
  password VARCHAR(60)
);

CREATE TABLE items(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  user_id INT REFERENCES users(id)
);