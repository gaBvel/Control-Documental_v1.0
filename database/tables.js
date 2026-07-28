const pool = require('./connection');
require('dotenv').config();

async function createTables() {
    await pool.promise().query(
        `CREATE TABLE IF NOT EXISTS usuarios_sistema(
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(200),
            correo VARCHAR(150) UNIQUE,
            password VARCHAR(255),
            rol ENUM(
                'archivo',
                'usuario',
                'director',
                'administrador'
            ),
            puesto VARCHAR(100),
            area VARCHAR(150)
        );`
    );

    console.log('Tabla creada con exito');
}

module.exports = createTables;