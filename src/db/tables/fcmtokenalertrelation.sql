BEGIN TRANSACTION;

CREATE TABLE fcmtokenalertrelation (
    fcm_token_id int NOT NULL,
    alert_id int NOT NULL,
    PRIMARY KEY (fcm_token_id, alert_id),
    FOREIGN KEY (fcm_token_id) REFERENCES fcmtoken(fcm_token_id) ON UPDATE CASCADE,
    FOREIGN KEY (alert_id) REFERENCES alert(alert_id) ON UPDATE CASCADE
);

COMMIT;

