//Dependencias
const dotenv = require('dotenv');

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

//Configuracion
dotenv.config();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/resources', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

//Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

//Base de datos
const createDatabase = require('./database/createDb');
const createTables = require('./database/tables');
const seedData = require('./database/seedData');

//Rutas
app.use(require('./routes/auth'));
app.use(require('./routes/archivoR'));
app.use(require('./routes/usuarioR'));
app.use(require('./routes/directorR'));
app.use(require('./routes/adminR'));

app.get('/', (req, res) => {
    res.render('login/login', {
        title: 'Sistema de Control Documental',
        styles: ['login.css']
    });
});

//404 - Ruta no encontrada
app.use((req, res) => {
    res.status(404).send('Pagina no encontrada');
});

//Inicializacion de la base de datos y arranque del servidor
async function iniciarServidor() {
    try {
        await createDatabase();
        await createTables();
        await seedData();

        app.listen(process.env.PORT, () => {
            console.log(`Servidor corriendo en puerto: ${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
}

iniciarServidor();
