BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    gender text NOT NULL,
    age BIGINT DEFAULT 0,
    address text NOT NULL,
    joined TIMESTAMP NOT NULL
);

COMMIT;