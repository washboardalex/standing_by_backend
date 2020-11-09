BEGIN TRANSACTION;

CREATE TABLE fcmtokenalertrelation (
    fcmtokenid int NOT NULL,
    alertid int NOT NULL,
    PRIMARY KEY (fcmtokenid, alertid),
    FOREIGN KEY (fcmtokenid) REFERENCES fcmtoken(fcmtokenid) ON UPDATE CASCADE,
    FOREIGN KEY (alertid) REFERENCES alert(alertid) ON UPDATE CASCADE
);

COMMIT;

