const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');
const documental = require('../controllers/documentalController');

//Ruta principal
router.get('/archivo', auth, roles.soloArchivo, pages.archivo);

router.get('/archivo/historial', auth, roles.soloArchivo, documental.historialArchivo);

router.get('/archivo/revision', auth, roles.soloArchivo, documental.revisionArchivo);
router.post('/archivo/inventario/:id/estatus', auth, roles.soloArchivo, documental.actualizarEstatus);

module.exports = router;
