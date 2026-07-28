const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');

//Ruta principal
router.get('/archivo', auth, roles.soloArchivo, pages.archivo);

router.get('/archivo/historial', auth, roles.soloArchivo, pages.archivoHistorial);

router.get('/archivo/revision', auth, roles.soloArchivo, pages.archivoRevision);

module.exports = router;
