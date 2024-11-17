const express = require('express'); 
const morgan = require('morgan'); 
const exphbs = require('express-handlebars'); // Necesario para utilizar el motor de plantillas handlebars 
const path = require('path'); 
const flash = require('connect-flash'); // Nos permite manejar mensajes en la sesión los cuales se guardan en memoria y se borran luego de ser mostrados
const session = require('express-session'); // Permite manejar sesiones, por ejemplo, para almacenar datos en la memoria del servidor, también se puede almacenar en la base de datos
const MySQLStore = require('express-mysql-session')(session); 
const passport = require('passport'); // Necesario para autenticación del usuario 

// Inicializaciones 
const app = express(); 
require('dotenv').config();
const { database } = require('./config/key'); 
require('./lib/passportConfig'); // Permite que passport se entere de la autenticación que estoy creando

// Ajustes del servidor 
app.set('port', process.env.PORT || 4500); 
app.set('views', path.join(__dirname, 'views')); // Configuración de la ruta donde se encuentran las vistas 
app.engine('.hbs', exphbs.engine({ 
    defaultLayout: 'main', // Configuración del layout principal 
    layoutsDir: path.join(app.get('views'), 'layouts'), // Configuración de la ruta de los layouts 
    partialsDir: path.join(app.get('views'), 'partials'), // Configuración de vistas parciales 
    extname: '.hbs', // Configura la extensión que tendrán los archivos HandleBars 
    helpers: require('./lib/handlebars') // Configuración de funciones 
})); 
app.set('view engine', '.hbs'); // Configuración para ejecutar el motor de plantillas 

// ===== MIDDLEWARES === 
// Primero inicializamos el middleware de sesión
app.use(session({ 
    secret: process.env.SESSION_KEY, // Esta es la clave secreta de la sesión
    resave: false, // Para que no renueve la sesión 
    saveUninitialized: false, // Se deja en false para que no vuelva a establecer la sesión 
    store: new MySQLStore(database) // Se indica dónde se debe guardar la sesión 
})); 

// Luego inicializamos Passport
app.use(passport.initialize()); // Inicia passport
app.use(passport.session()); // Se indica dónde se deben guardar los datos de la sesión

app.use(flash()); 
app.use(morgan('dev')); // Configurando el middleware morgan para visualizar que está llegando al servidor 
app.use(express.urlencoded({ extended: false })); // Sirve para poder aceptar datos desde formularios 

// ==== VARIABLES GLOBALES ===== 
app.use((request, response, next) => { 
    // Haciendo global el uso de flash 
    app.locals.success = request.flash('success'); 
    app.locals.error = request.flash('error'); 
    app.locals.user = request.user; // Manejo global del usuario 
    next(); // Permite continuar con la ejecución del código 
}); 

// Configuración de rutas 
app.use(require('./routes')); // Node automáticamente busca el index.js del módulo 
app.use(require('./routes/authentication')); 
app.use('/estudiantes', require('./routes/estudiantes')); // Configuración de ruta para estudiantes 
app.use('/carreras', require('./routes/carreras')); // Configuración de ruta para carreras 
app.use('/materias', require('./routes/materias')); // Configuración de ruta para materias 
app.use('/profesores', require('./routes/profesores')); // Configuración de ruta para profesores 
app.use('/grupos', require('./routes/grupos')); // Configuración de ruta para grupos 

// Archivos públicos (acá se coloca todo el código al cual el navegador puede acceder) 
app.use(express.static(path.join(__dirname, 'public'))); 

// Iniciar el servidor  
app.listen(app.get('port'), () => { 
    console.log('Servidor iniciado en el puerto: ', app.get('port')); 
});
