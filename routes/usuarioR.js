const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');

//Ruta Principal
router.get('/usuario', auth, roles.soloUsuario, pages.usuario);

//Normativa
router.get('/usuario/normativa', auth, roles.soloUsuario, pages.usuarioNormativa);

//Inventario
router.get('/usuario/inventario', auth, roles.soloUsuario, pages.usuarioInventario);

//Dictámenes
router.get('/usuario/dictamen', auth, roles.soloUsuario, pages.usuarioDictamen);

//Historial
router.get('/usuario/historial', auth, roles.soloUsuario, pages.usuarioHistorial);

module.exports = router;




