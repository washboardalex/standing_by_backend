BEGIN TRANSACTION;

CREATE TABLE coin (
    coinid serial PRIMARY KEY,
    symbol varchar(255) NOT NULL,
    name varchar(255) NOT NULL
);

COMMIT;