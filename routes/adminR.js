const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');
const admin = require('../controllers/adminController');

//Ruta principal
router.get('/admin', auth, roles.soloAdministrador, admin.panel);
router.get('/admin/usuarios', auth, roles.soloAdministrador, admin.usuarios);
router.get('/admin/inventarios', auth, roles.soloAdministrador, admin.inventarios);
router.get('/admin/dictamen', auth, roles.soloAdministrador, admin.dictamenes);
router.get('/admin/historial', auth, roles.soloAdministrador, admin.historial);

module.exports = router;
