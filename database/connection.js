const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');
require('dotenv').config();

// Pool principal: ya asume que la base de datos existe (se usa en toda
// la app despues de haber corrido bootstrap.js una vez al iniciar el servidor).
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10
});

// Conexion "cruda" SIN database, solo para poder crear la base de datos
// la primera vez (evita el error ER_BAD_DB_ERROR si aun no existe).
async function getBootstrapConnection() {
    return mysqlPromise.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });
}

module.exports = pool;
module.exports.getBootstrapConnection = getBootstrapConnection;
