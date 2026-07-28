const bcrypt = require('bcrypt');
const pool = require('./connection');
require('dotenv').config();

async function seedData() {
    const db = pool.promise();

    // Evita error de "correo duplicado" (UNIQUE) si el servidor ya se
    // habia iniciado antes y los usuarios de prueba ya existen.
    const [existentes] = await db.query(
        'SELECT COUNT(*) AS total FROM usuarios_sistema'
    );
    if (existentes[0].total > 0) {
        console.log('Datos de prueba ya existian, se omite la insercion.');
        return;
    }

    const usuariosPrueba = [
        ['Archivo', 'archivo@rtvh.com', '123456789', 'archivo', 'Encargado de Archivo', 'Archivo'],
        ['Usuario', 'usuario@rtvh.com', '123456789', 'usuario', 'Capturista', 'Programacion'],
        ['Director', 'director@rtvh.com', '123456789', 'director', 'Director General', 'Direccion'],
        ['Administrador', 'admin@rtvh.com', '123456789', 'administrador', 'Administrador', 'Sistemas']
    ];

    // Las contraseñas de prueba se hashean antes de guardarse, igual que
    // se haria con cualquier usuario real (auth.js ya sabe leer hashes bcrypt).
    for (const usuario of usuariosPrueba) {
        usuario[2] = await bcrypt.hash(usuario[2], 10);
    }

    await db.query(
        `INSERT INTO usuarios_sistema(nombre, correo, password, rol, puesto, area)
        VALUES ?`,
        [usuariosPrueba]
    );

    console.log('Datos de prueba insertados con exito!!!');
}

module.exports = seedData;