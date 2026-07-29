const express = require('express');
const router = express.Router();

const auth = require('../middleware/authM');
const roles = require('../middleware/roles');

const pages = require('../controllers/pageController');
const admin = require('../controllers/adminController');

//Ruta principal
router.get('/admin', auth, roles.soloAdministrador, admin.panel);

module.exports = router;
