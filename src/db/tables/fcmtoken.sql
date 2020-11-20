BEGIN TRANSACTION;

CREATE TABLE fcmtoken (
    fcm_token_id serial PRIMARY KEY,
    device_id varchar(255) UNIQUE NOT NULL,
    token varchar(255) UNIQUE NOT NULL
);

COMMIT;