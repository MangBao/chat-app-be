--# psql -U postgres -d chat_app

CREATE DATABASE chat_app;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL
);

INSERT INTO users(username, passhash) VALUES ($1, $2);
