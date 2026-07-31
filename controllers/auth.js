const bcrypt = require('bcrypt');
const db = require('../database/connection');

async function login(req, res) {
    const { correo, password } = req.body;
    const sql = 'SELECT * FROM usuarios_sistema WHERE correo = ?';

    db.query(sql, [correo], async (err, resultados) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ ok: false, message: 'Error del servidor.' });
        }
        if (!resultados.length) {
            return res.status(401).json({ ok: false, field: 'correo', message: 'Correo incorrecto.' });
        }

        const usuario = resultados[0];
        const acceso = usuario.password.startsWith('$2')
            ? await bcrypt.compare(password, usuario.password)
            : password === usuario.password;
        if (!acceso) {
            return res.status(401).json({ ok: false, field: 'password', message: 'Contraseña incorrecta.' });
        }

        req.session.usuario = usuario;
        const destinos = { archivo: '/archivo', usuario: '/usuario', director: '/director', administrador: '/admin' };
        return res.json({ ok: true, message: 'Sesión iniciada correctamente.', redirect: destinos[usuario.rol] || '/' });
    });
}

function logout(req, res) {
    req.session.destroy(() => res.redirect('/'));
}

module.exports = { login, logout };
