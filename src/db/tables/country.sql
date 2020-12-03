BEGIN TRANSACTION;

CREATE TABLE country (
    country_id serial PRIMARY KEY,
    country_code varchar(255) UNIQUE NOT NULL,
    country_name varchar(255) NOT NULL,
    country_slug varchar(255) NOT NULL
);

COMMIT;