const { getMenu } = require('../config/menu');

const roleNames = {
    archivo: 'Archivo',
    usuario: 'Usuario',
    director: 'Director',
    administrador: 'Administrador'
};

function render(view, title, active, styles = []) {
    return (req, res) => res.render(view, {
        title,
        active,
        styles,
        usuario: req.session.usuario,
        menu: getMenu(roleNames[req.session.usuario.rol], active)
    });
}

module.exports = {
    archivo: render('Archivo/archivo', 'Panel Archivo', 'dashboard', ['Archivo/archivo.css']),
    archivoHistorial: render('Archivo/historial', 'Historial de Archivo', 'historial', ['Archivo/historial.css']),
    archivoRevision: render('Archivo/revision', 'Revisión de inventarios', 'revision', ['Archivo/revision.css']),
    usuario: render('Usuario/usuario', 'Panel Usuario', 'dashboard', ['Usuario/usuario.css']),
    usuarioInventario: render('Usuario/inventario', 'Inventario documental', 'inventario', ['Usuario/inventario.css']),
    usuarioHistorial: render('Usuario/historial', 'Historial de usuario', 'historial', ['Usuario/historial.css']),
    usuarioNormativa: render('Usuario/normativa', 'Normatividad', 'normativa', ['Usuario/normativa.css']),
    director: render('Director/director', 'Panel Director', 'dashboard', ['Director/director.css']),
    directorInventario: render('Director/inventario', 'Control de inventarios', 'inventario', ['Director/inventario.css']),
    directorHistorial: render('Director/historial', 'Historial del Director', 'historial', ['Director/historial.css']),
    admin: render('Administrador/admin', 'Panel Administrador', 'dashboard', ['Administrador/admin.css'])
};
