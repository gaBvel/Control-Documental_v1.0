const bcrypt = require('bcrypt');
const db = require('../database/connection');

async function login(req, res) {
    const {correo, password} = req.body;
    const sql = `
    SELECT * FROM usuarios_sistema WHERE correo = ?`;

    db.query(sql, [correo], async (err, resultados) => {
        if(err){
            console.log(err);
            return res.send('Error del servidor');
        }

        if(resultados.length===0){
            return res.send('Correo Incorrecto');
        }

        const usuario=resultados[0];
        let acceso = false;
        if(usuario.password.startsWith('$2')){
            acceso = await bcrypt.compare(password, usuario.password);
        }else{
            acceso = password === usuario.password;
        }

        if(!acceso) {
            return res.send('Constraseña Incorrecta');
        }
        req.session.usuario = usuario;
        switch(usuario.rol){
            case 'archivo':
                return res.redirect('/archivo');
            case 'usuario':
                return res.redirect('/usuario');
            case 'director':
                return res.redirect('/director');
            case 'administrador':
                return res.redirect('/admin');
            default:
                return res.redirect('/');
        }
    });
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/')
    });
}

module.exports = {login, logout};