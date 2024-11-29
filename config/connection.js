const mysql = require('mysql2');
const config = require('./config');
const mysql2 = require("mysql2/promise");

const connection = mysql.createConnection(config.connection);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
});

const connectionPool = mysql2.createPool({
    ...config.connection,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    connection,
    config,
    connectionPool
};