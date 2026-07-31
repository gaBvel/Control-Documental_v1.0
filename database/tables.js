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

    await pool.promise().query(
        `CREATE TABLE IF NOT EXISTS registro_inventario(
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_usuario INT NOT NULL,
            subfondo VARCHAR(200) NOT NULL,
            unidad_administrativa VARCHAR(200) NOT NULL,
            area_generadora VARCHAR(200) NOT NULL,
            archivo_scv VARCHAR(255) NOT NULL,
            estatus ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',
            fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            fecha_revision DATETIME NULL,
            CONSTRAINT fk_registro_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios_sistema(id)
        );`
    );

    await pool.promise().query(
        `CREATE TABLE IF NOT EXISTS inventario_documental(
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_registro_inventario INT NOT NULL,
            ubicacion_topografica VARCHAR(200),
            soporte ENUM('electronico', 'fisico'),
            titulo VARCHAR(255),
            descripcion TEXT,
            gestion_fecha_apertura DATE NULL,
            gestion_fecha_cierre DATE NULL,
            recepcion_fecha_apertura DATE NULL,
            recepcion_fecha_cierre DATE NULL,
            observacion_generador TEXT,
            observacion_archivo TEXT,
            CONSTRAINT fk_documental_registro FOREIGN KEY (id_registro_inventario) REFERENCES registro_inventario(id) ON DELETE CASCADE
        );`
    );

    await pool.promise().query(
        `CREATE TABLE IF NOT EXISTS dictamen(
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_usuario INT NULL,
            fecha_dictamen DATE NOT NULL,
            archivo_dictamen VARCHAR(255) NOT NULL,
            tipo_dictamen VARCHAR(100) NOT NULL,
            archivo_acta VARCHAR(255) NULL,
            evidencia VARCHAR(255) NULL,
            observacion TEXT NULL,
            estatus ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',
            fecha_revision DATETIME NULL,
            CONSTRAINT fk_dictamen_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios_sistema(id)
        );`
    );

    const [columnas] = await pool.promise().query("SHOW COLUMNS FROM dictamen LIKE 'id_usuario'");
    if (!columnas.length) {
        await pool.promise().query('ALTER TABLE dictamen ADD COLUMN id_usuario INT NULL AFTER id');
        await pool.promise().query('ALTER TABLE dictamen ADD CONSTRAINT fk_dictamen_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios_sistema(id)');
    }

    const [estatusDictamen] = await pool.promise().query("SHOW COLUMNS FROM dictamen LIKE 'estatus'");
    if (!estatusDictamen.length) {
        await pool.promise().query("ALTER TABLE dictamen ADD COLUMN estatus ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente'");
    }
    const [fechaRevisionDictamen] = await pool.promise().query("SHOW COLUMNS FROM dictamen LIKE 'fecha_revision'");
    if (!fechaRevisionDictamen.length) {
        await pool.promise().query('ALTER TABLE dictamen ADD COLUMN fecha_revision DATETIME NULL');
    }

    console.log('Tabla creada con exito');
}

module.exports = createTables;
