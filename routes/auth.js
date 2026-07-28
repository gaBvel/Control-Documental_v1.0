const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

//Rutas
router.post('/login', auth.login);

router.get('/logout', auth.logout);

module.exports = router;

