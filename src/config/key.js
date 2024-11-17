require('dotenv').config();

if (!process.env.HOST || !process.env.USER || !process.env.PASSWORD || !process.env.DATABASE_NAME || !process.env.PORT_DATABASE) {
    throw new Error('Missing required environment variables');
}

module.exports = {
    database: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE_NAME,
        port: process.env.PORT_DATABASE,
    }
};