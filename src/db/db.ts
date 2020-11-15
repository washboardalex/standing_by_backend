import knex from 'knex';
require('dotenv').config();

export const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

console.log(process.env.POSTGRES_URI);
console.log(db);
