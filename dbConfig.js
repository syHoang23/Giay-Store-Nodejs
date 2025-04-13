require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectString: process.env.DB_CONNECT
};

module.exports = dbConfig;