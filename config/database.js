// config/database.js
const { Sequelize } = require('sequelize');

const config = {
    development: {
        username: 'root',
        password: 'gabi2004',
        database: 'clothing_store',
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
        logging: false
    },
    production: {
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DB_NAME,
        host: process.env.RDS_HOSTNAME,
        dialect: 'mysql',
        port: 3306,
        logging: false
    }
};

const sequelize = new Sequelize(
    process.env.NODE_ENV === 'production'
        ? config.production
        : config.development
);

module.exports = sequelize;