const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');
const admin = require('../controllers/adminController');
const documental = require('../controllers/documentalController');

//Ruta principal
router.get('/admin', auth, roles.soloAdministrador, admin.panel);
router.get('/admin/usuarios', auth, roles.soloAdministrador, admin.usuarios);
router.get('/admin/inventarios', auth, roles.soloAdministrador, admin.inventarios);
router.get('/admin/inventario', auth, roles.soloAdministrador, admin.registrarInventarioPagina);
router.post('/admin/inventario', auth, roles.soloAdministrador, documental.csvUpload.single('archivoCsv'), documental.registrarInventario);
router.post('/admin/inventario/:id/eliminar', auth, roles.soloAdministrador, documental.eliminarInventario);
router.get('/admin/dictamen', auth, roles.soloAdministrador, admin.dictamenes);
router.post('/admin/dictamen', auth, roles.soloAdministrador, documental.documentUpload.fields([{ name: 'archivoDictamen', maxCount: 1 }, { name: 'archivoActa', maxCount: 1 }, { name: 'evidencia', maxCount: 1 }]), documental.registrarDictamen);
router.post('/admin/dictamen/:id/eliminar', auth, roles.soloAdministrador, documental.eliminarDictamen);
router.get('/admin/historial', auth, roles.soloAdministrador, admin.historial);

module.exports = router;
