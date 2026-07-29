const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');
const documental = require('../controllers/documentalController');


//Ruta principal
router.get('/director', auth, roles.soloDirector, documental.director);
router.get('/director/inventario', auth, roles.soloDirector, documental.inventariosDirector);
router.get('/director/historial', auth, roles.soloDirector, documental.historialDirector);

module.exports = router;
