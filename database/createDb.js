const { getBootstrapConnection } = require('./connection');
require('dotenv').config();

async function createDatabase(){
    const connection = await getBootstrapConnection();

    await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );

    await connection.end();

    console.log('Base de datos verificada/creada con exito!!!');
}

module.exports = createDatabase;