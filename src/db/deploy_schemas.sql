-- Deploy fresh database tabels:
\i '/docker-entrypoint-initdb.d/tables/country.sql'
\i '/docker-entrypoint-initdb.d/tables/fcmtoken.sql'
\i '/docker-entrypoint-initdb.d/tables/alert.sql'
\i '/docker-entrypoint-initdb.d/tables/fcmtokenalertrelation.sql'


-- For testing purposes only. This file will add dummy data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'