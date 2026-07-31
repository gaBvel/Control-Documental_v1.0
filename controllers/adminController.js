const pool = require('../database/connection').promise();
const { getMenu } = require('../config/menu');

function render(req, res, view, title, active, datos) {
    res.render(view, { title, active, styles: ['Administrador/admin.css'], usuario: req.session.usuario, menu: getMenu('Administrador', active), formAction: '/admin/dictamen', ...datos });
}

async function actividadReciente() {
    const [actividad] = await pool.query(`
        SELECT r.id AS registro_id, 'inventario' AS tipo_registro, u.nombre AS usuario, 'Inventario enviado' AS accion, 'Inventarios' AS modulo, r.fecha_envio AS fecha, r.estatus
        FROM registro_inventario r INNER JOIN usuarios_sistema u ON u.id = r.id_usuario
        UNION ALL
        SELECT d.id AS registro_id, 'dictamen' AS tipo_registro, 'Sistema' AS usuario, 'Dictamen registrado' AS accion, 'Dictámenes' AS modulo, d.fecha_dictamen AS fecha, 'aprobado' AS estatus
        FROM dictamen d
        ORDER BY fecha DESC
    `);
    return actividad;
}

async function actividadDeUsuario(idUsuario) {
    const [actividad] = await pool.query(`
        SELECT r.id AS registro_id, 'inventario' AS tipo_registro, u.nombre AS usuario, 'Inventario enviado' AS accion, 'Inventarios' AS modulo, r.fecha_envio AS fecha, r.estatus
        FROM registro_inventario r INNER JOIN usuarios_sistema u ON u.id = r.id_usuario WHERE r.id_usuario = ?
        UNION ALL
        SELECT d.id AS registro_id, 'dictamen' AS tipo_registro, u.nombre AS usuario, 'Dictamen registrado' AS accion, 'Dictámenes' AS modulo, d.fecha_dictamen AS fecha, d.estatus
        FROM dictamen d INNER JOIN usuarios_sistema u ON u.id = d.id_usuario WHERE d.id_usuario = ?
        ORDER BY fecha DESC
    `, [idUsuario, idUsuario]);
    return actividad;
}

async function panel(req, res) {
    const [[usuarios], [inventarios], [dictamenes], [pendientes], actividad] = await Promise.all([
        pool.query('SELECT COUNT(*) AS total FROM usuarios_sistema'),
        pool.query('SELECT COUNT(*) AS total FROM registro_inventario'),
        pool.query('SELECT COUNT(*) AS total FROM dictamen'),
        pool.query("SELECT COUNT(*) AS total FROM registro_inventario WHERE estatus = 'pendiente'"),
        actividadReciente()
    ]);
    render(req, res, 'Administrador/admin', 'Panel Administrador', 'dashboard', {
        resumen: { usuarios: usuarios[0].total, inventarios: inventarios[0].total, dictamenes: dictamenes[0].total, pendientes: pendientes[0].total },
        actividad: actividad.slice(0, 8)
    });
}

async function usuarios(req, res) {
    const [registros] = await pool.query('SELECT id, nombre, correo, rol, puesto, area FROM usuarios_sistema ORDER BY nombre');
    render(req, res, 'Administrador/usuarios', 'Usuarios del sistema', 'usuarios', { usuarios: registros });
}

async function inventarios(req, res) {
    const [registros] = await pool.query(`SELECT r.*, u.nombre FROM registro_inventario r INNER JOIN usuarios_sistema u ON u.id = r.id_usuario ORDER BY r.fecha_envio DESC`);
    render(req, res, 'Administrador/inventario', 'Inventarios registrados', 'inventarios', { inventarios: registros });
}

async function dictamenes(req, res) {
    const [registros] = await pool.query('SELECT * FROM dictamen ORDER BY fecha_dictamen DESC, id DESC');
    render(req, res, 'Administrador/dictamen', 'Dictámenes registrados', 'dictamen', { dictamenes: registros });
}

async function historial(req, res) {
    render(req, res, 'Administrador/historial', 'Mi historial', 'historial', { actividad: await actividadDeUsuario(req.session.usuario.id) });
}

function registrarInventarioPagina(req, res) {
    res.render('Usuario/inventario', { title: 'Registrar inventario', active: 'inventarios', styles: ['Usuario/inventario.css'], usuario: req.session.usuario, menu: getMenu('Administrador', 'inventarios'), registroInventarioUrl: '/admin/inventario' });
}

module.exports = { panel, usuarios, inventarios, dictamenes, historial, registrarInventarioPagina };
