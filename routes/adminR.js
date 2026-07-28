const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');

//Ruta principal
router.get('/admin', auth, roles.soloAdministrador, pages.admin);

module.exports = router;
