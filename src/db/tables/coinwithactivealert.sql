BEGIN TRANSACTION;

CREATE TABLE coinwithactivealert (
    coinid integer PRIMARY KEY,
    FOREIGN KEY (coinid) REFERENCES coin(coinid) ON DELETE CASCADE
);

COMMIT;