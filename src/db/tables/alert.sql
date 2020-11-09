BEGIN TRANSACTION;

CREATE TABLE alert (
    alertid serial PRIMARY KEY,
    condition varchar(255) NOT NULL,
    value decimal(20,10) NOT NULL,
    type varchar(255) NOT NULL,
    coinid integer NOT NULL,
    FOREIGN KEY (coinid) REFERENCES coin(coinid) ON DELETE CASCADE
);

COMMIT;