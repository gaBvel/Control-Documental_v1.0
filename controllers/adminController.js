const pool = require('../database/connection').promise();
const { getMenu } = require('../config/menu');

async function panel(req, res) {
    const [[usuarios], [inventarios], [dictamenes], [pendientes], [actividad]] = await Promise.all([
        pool.query('SELECT COUNT(*) AS total FROM usuarios_sistema'),
        pool.query('SELECT COUNT(*) AS total FROM registro_inventario'),
        pool.query('SELECT COUNT(*) AS total FROM dictamen'),
        pool.query("SELECT COUNT(*) AS total FROM registro_inventario WHERE estatus = 'pendiente'"),
        pool.query(`
            SELECT u.nombre AS usuario, 'Inventario enviado' AS accion, 'Inventarios' AS modulo, r.fecha_envio AS fecha, r.estatus
            FROM registro_inventario r
            INNER JOIN usuarios_sistema u ON u.id = r.id_usuario
            UNION ALL
            SELECT 'Sistema' AS usuario, 'Dictamen registrado' AS accion, 'Dictámenes' AS modulo, d.fecha_dictamen AS fecha, 'aprobado' AS estatus
            FROM dictamen d
            ORDER BY fecha DESC
            LIMIT 8
        `)
    ]);

    res.render('Administrador/admin', {
        title: 'Panel Administrador',
        active: 'dashboard',
        styles: ['Administrador/admin.css'],
        usuario: req.session.usuario,
        menu: getMenu('Administrador', 'dashboard'),
        resumen: { usuarios: usuarios[0].total, inventarios: inventarios[0].total, dictamenes: dictamenes[0].total, pendientes: pendientes[0].total },
        actividad
    });
}

module.exports = { panel };
