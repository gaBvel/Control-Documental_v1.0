const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pool = require('../database/connection').promise();

const uploadDirectory = path.join(__dirname, '..', 'public', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
    }
});

const csvUpload = multer({
    storage,
    fileFilter: (req, file, callback) => callback(null, path.extname(file.originalname).toLowerCase() === '.csv')
});

const documentUpload = multer({ storage });

function normalizar(texto = '') {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

function separarCsv(linea) {
    const resultado = [];
    let valor = '';
    let entreComillas = false;
    for (let indice = 0; indice < linea.length; indice += 1) {
        const caracter = linea[indice];
        if (caracter === '"') {
            if (entreComillas && linea[indice + 1] === '"') { valor += '"'; indice += 1; } else entreComillas = !entreComillas;
        } else if (caracter === ',' && !entreComillas) { resultado.push(valor.trim()); valor = ''; } else valor += caracter;
    }
    resultado.push(valor.trim());
    return resultado;
}

function documentosDesdeCsv(rutaArchivo) {
    const lineas = fs.readFileSync(rutaArchivo, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter((linea) => linea.trim());
    if (lineas.length < 2) return [];
    const encabezados = separarCsv(lineas[0]).map(normalizar);
    const indice = (nombre) => encabezados.indexOf(nombre);
    const valor = (fila, nombre) => {
        const posicion = indice(nombre);
        return posicion === -1 ? null : fila[posicion] || null;
    };
    return lineas.slice(1).map(separarCsv).map((fila) => ({
        ubicacion_topografica: valor(fila, 'ubicacion topografica') || valor(fila, 'ubicacion_topografica'),
        soporte: normalizar(valor(fila, 'soporte')) === 'electronico' ? 'electronico' : (normalizar(valor(fila, 'soporte')) === 'fisico' ? 'fisico' : null),
        titulo: valor(fila, 'titulo'), descripcion: valor(fila, 'descripcion'),
        gestion_fecha_apertura: valor(fila, 'gestion fecha apertura') || valor(fila, 'gestion_fecha_apertura'),
        gestion_fecha_cierre: valor(fila, 'gestion fecha cierre') || valor(fila, 'gestion_fecha_cierre'),
        recepcion_fecha_apertura: valor(fila, 'recepcion fecha apertura') || valor(fila, 'recepcion_fecha_apertura'),
        recepcion_fecha_cierre: valor(fila, 'recepcion fecha cierre') || valor(fila, 'recepcion_fecha_cierre'),
        observacion_generador: valor(fila, 'observacion generador') || valor(fila, 'observacion_generador')
    }));
}

async function usuario(req, res) {
    const [conteos] = await pool.query(`SELECT estatus, COUNT(*) total FROM registro_inventario WHERE id_usuario = ? GROUP BY estatus`, [req.session.usuario.id]);
    const resumen = { pendiente: 0, aprobado: 0, rechazado: 0 };
    conteos.forEach((fila) => { resumen[fila.estatus] = fila.total; });
    const [recientes] = await pool.query('SELECT * FROM registro_inventario WHERE id_usuario = ? ORDER BY fecha_envio DESC LIMIT 5', [req.session.usuario.id]);
    res.render('Usuario/usuario', { title: 'Panel Usuario', active: 'dashboard', styles: ['Usuario/usuario.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Usuario', 'dashboard'), resumen, recientes });
}

async function resumenGlobal() {
    const [[total], [conteos], [dictamenes]] = await Promise.all([
        pool.query('SELECT COUNT(*) AS total FROM registro_inventario'),
        pool.query('SELECT estatus, COUNT(*) AS total FROM registro_inventario GROUP BY estatus'),
        pool.query('SELECT COUNT(*) AS total FROM dictamen')
    ]);
    const resumen = { total: total[0].total, pendiente: 0, aprobado: 0, rechazado: 0, dictamenes: dictamenes[0].total };
    conteos.forEach((fila) => { resumen[fila.estatus] = fila.total; });
    return resumen;
}

async function archivo(req, res) {
    const [resumen, recientes] = await Promise.all([
        resumenGlobal(),
        pool.query(`SELECT r.*, u.nombre FROM registro_inventario r INNER JOIN usuarios_sistema u ON u.id = r.id_usuario WHERE r.estatus = 'pendiente' ORDER BY r.fecha_envio ASC LIMIT 5`)
    ]);
    res.render('Archivo/archivo', { title: 'Panel Archivo', active: 'dashboard', styles: ['Archivo/archivo.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Archivo', 'dashboard'), resumen, recientes: recientes[0] });
}

async function director(req, res) {
    const [resumen, recientes] = await Promise.all([
        resumenGlobal(),
        pool.query(`SELECT r.*, u.nombre FROM registro_inventario r INNER JOIN usuarios_sistema u ON u.id = r.id_usuario ORDER BY r.fecha_envio DESC LIMIT 5`)
    ]);
    res.render('Director/director', { title: 'Panel Director', active: 'dashboard', styles: ['Director/director.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Director', 'dashboard'), resumen, recientes: recientes[0] });
}

async function inventariosDirector(req, res) {
    const [inventarios] = await pool.query(`SELECT r.*, u.nombre FROM registro_inventario r INNER JOIN usuarios_sistema u ON u.id = r.id_usuario ORDER BY r.fecha_envio DESC`);
    res.render('Director/inventario', { title: 'Control de inventarios', active: 'inventario', styles: ['Director/inventario.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Director', 'inventario'), inventarios });
}

async function historialDirector(req, res) {
    const [inventarios] = await pool.query(`SELECT r.*, u.nombre FROM registro_inventario r INNER JOIN usuarios_sistema u ON u.id = r.id_usuario ORDER BY COALESCE(r.fecha_revision, r.fecha_envio) DESC`);
    res.render('Director/historial', { title: 'Historial del Director', active: 'historial', styles: ['Director/historial.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Director', 'historial'), inventarios });
}

async function historialUsuario(req, res) {
    const [inventarios] = await pool.query(`SELECT r.*, u.nombre FROM registro_inventario r JOIN usuarios_sistema u ON u.id = r.id_usuario WHERE r.id_usuario = ? ORDER BY r.fecha_envio DESC`, [req.session.usuario.id]);
    res.render('Usuario/historial', { title: 'Historial de usuario', active: 'historial', styles: ['Usuario/historial.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Usuario', 'historial'), inventarios });
}

async function registrarInventario(req, res) {
    if (!req.file) return res.status(400).send('Debes cargar un archivo CSV válido.');
    const { subfondo, unidadAdministrativa, areaGeneradora } = req.body;
    if (!subfondo || !unidadAdministrativa || !areaGeneradora) return res.status(400).send('Completa los datos requeridos.');
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();
        const [registro] = await conexion.query('INSERT INTO registro_inventario(id_usuario, subfondo, unidad_administrativa, area_generadora, archivo_scv) VALUES (?, ?, ?, ?, ?)', [req.session.usuario.id, subfondo, unidadAdministrativa, areaGeneradora, `/resources/uploads/${req.file.filename}`]);
        const documentos = documentosDesdeCsv(req.file.path);
        for (const documento of documentos) {
            await conexion.query(`INSERT INTO inventario_documental(id_registro_inventario, ubicacion_topografica, soporte, titulo, descripcion, gestion_fecha_apertura, gestion_fecha_cierre, recepcion_fecha_apertura, recepcion_fecha_cierre, observacion_generador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [registro.insertId, documento.ubicacion_topografica, documento.soporte, documento.titulo, documento.descripcion, documento.gestion_fecha_apertura, documento.gestion_fecha_cierre, documento.recepcion_fecha_apertura, documento.recepcion_fecha_cierre, documento.observacion_generador]);
        }
        await conexion.commit();
        res.redirect('/usuario/historial');
    } catch (error) {
        await conexion.rollback();
        res.status(500).send('No fue posible registrar el inventario.');
    } finally { conexion.release(); }
}

async function revisionArchivo(req, res) {
    const [inventarios] = await pool.query(`SELECT r.*, u.nombre FROM registro_inventario r JOIN usuarios_sistema u ON u.id = r.id_usuario WHERE r.estatus = 'pendiente' ORDER BY r.fecha_envio ASC`);
    res.render('Archivo/revision', { title: 'Revisión de inventarios', active: 'revision', styles: ['Archivo/revision.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Archivo', 'revision'), inventarios });
}

async function historialArchivo(req, res) {
    const [inventarios] = await pool.query(`SELECT r.*, u.nombre FROM registro_inventario r JOIN usuarios_sistema u ON u.id = r.id_usuario ORDER BY r.fecha_envio DESC`);
    res.render('Archivo/historial', { title: 'Historial de Archivo', active: 'historial', styles: ['Archivo/historial.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Archivo', 'historial'), inventarios });
}

async function actualizarEstatus(req, res) {
    const estatus = req.body.estatus;
    if (!['aprobado', 'rechazado'].includes(estatus)) return res.status(400).send('Estatus no válido.');
    await pool.query('UPDATE registro_inventario SET estatus = ?, fecha_revision = NOW() WHERE id = ?', [estatus, req.params.id]);
    res.redirect('/archivo/revision');
}

async function paginaDictamen(req, res) {
    const [dictamenes] = await pool.query('SELECT * FROM dictamen ORDER BY fecha_dictamen DESC, id DESC');
    res.render('Usuario/dictamen', { title: 'Dictámenes', active: 'dictamen', styles: ['Usuario/dictamen.css'], usuario: req.session.usuario, menu: require('../config/menu').getMenu('Usuario', 'dictamen'), dictamenes });
}

async function registrarDictamen(req, res) {
    if (!req.files?.archivoDictamen?.[0]) return res.status(400).send('El archivo del dictamen es requerido.');
    const archivo = (nombre) => req.files?.[nombre]?.[0] ? `/resources/uploads/${req.files[nombre][0].filename}` : null;
    await pool.query('INSERT INTO dictamen(fecha_dictamen, archivo_dictamen, tipo_dictamen, archivo_acta, evidencia, observacion) VALUES (?, ?, ?, ?, ?, ?)', [req.body.fechaDictamen, archivo('archivoDictamen'), req.body.tipoDictamen, archivo('archivoActa'), archivo('evidencia'), req.body.observacion || null]);
    res.redirect('/usuario/dictamen');
}

module.exports = { csvUpload, documentUpload, usuario, historialUsuario, registrarInventario, archivo, director, inventariosDirector, historialDirector, revisionArchivo, historialArchivo, actualizarEstatus, paginaDictamen, registrarDictamen };
