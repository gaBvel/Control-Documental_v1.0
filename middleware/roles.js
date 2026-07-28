
function validarRol(rol) {
    return(req, res, next) => {
        if(req.session.usuario.rol!==rol){
            return res.redirect('/');
        }
        next();
    };
}

module.exports = {
    soloArchivo:
    validarRol('archivo'),

    soloUsuario:
    validarRol('usuario'),

    soloDirector:
    validarRol('director'),

    soloAdministrador:
    validarRol('administrador')
};