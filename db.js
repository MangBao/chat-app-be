const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
});

module.exports = pool;