BEGIN TRANSACTION;

CREATE TABLE alert (
    alert_id serial PRIMARY KEY,
    condition varchar(255) NOT NULL,
    value decimal(20,10) NOT NULL,
    type varchar(255) NOT NULL,
    country_id integer NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country(country_id) ON DELETE CASCADE
);

COMMIT;