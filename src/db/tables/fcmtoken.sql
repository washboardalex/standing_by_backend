BEGIN TRANSACTION;

CREATE TABLE fcmtoken (
    fcm_token_id serial PRIMARY KEY,
    token varchar(255) UNIQUE NOT NULL
);

COMMIT;