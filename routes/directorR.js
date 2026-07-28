const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');


//Ruta principal
router.get('/director', auth, roles.soloDirector, pages.director);
router.get('/director/inventario', auth, roles.soloDirector, pages.directorInventario);
router.get('/director/historial', auth, roles.soloDirector, pages.directorHistorial);

module.exports = router;
