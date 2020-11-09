BEGIN TRANSACTION;

CREATE TABLE fcmtoken (
    fcmtokenid serial PRIMARY KEY,
    token varchar(255) UNIQUE NOT NULL
);

COMMIT;