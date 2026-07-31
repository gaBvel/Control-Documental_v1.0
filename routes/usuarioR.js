const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');
const documental = require('../controllers/documentalController');

//Ruta Principal
router.get('/usuario', auth, roles.soloUsuario, documental.usuario);

//Normativa
router.get('/usuario/normativa', auth, roles.soloUsuario, pages.usuarioNormativa);

//Inventario
router.get('/usuario/inventario', auth, roles.soloUsuario, pages.usuarioInventario);
router.post('/usuario/inventario', auth, roles.soloUsuario, documental.csvUpload.single('archivoCsv'), documental.registrarInventario);
router.post('/usuario/inventario/:id/eliminar', auth, roles.soloUsuario, documental.eliminarInventario);

//Dictámenes
router.get('/usuario/dictamen', auth, roles.soloUsuario, documental.paginaDictamen);
router.post('/usuario/dictamen', auth, roles.soloUsuario, documental.documentUpload.fields([{ name: 'archivoDictamen', maxCount: 1 }, { name: 'archivoActa', maxCount: 1 }, { name: 'evidencia', maxCount: 1 }]), documental.registrarDictamen);
router.post('/usuario/dictamen/:id/eliminar', auth, roles.soloUsuario, documental.eliminarDictamen);

//Historial
router.get('/usuario/historial', auth, roles.soloUsuario, documental.historialUsuario);

module.exports = router;




