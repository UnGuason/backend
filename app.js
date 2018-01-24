
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


//inicializar Variables
var app= express();


//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//importar rutas

var  appRoutes = require('./routes/app');
var  usuarioRoutes = require('./routes/usuario');
var  loginRoutes = require('./routes/login');
var  hospitalesRoutes = require('./routes/hospitales');




//conexion a la case de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error,response) => {
if(error) throw error;
console.log('Base de Datos: \x1b[32m%s\x1b[0m',' 0nline');

});


//rutas
app.use('/usuario',usuarioRoutes);
app.use('/', appRoutes);
app.use('/login', loginRoutes);
app.use('/hospitales', hospitalesRoutes);




//Escuchar peticiones
app.listen(3000 ,()=>{
    console.log('express sercer puerto 3000: \x1b[32m%s\x1b[0m',' 0nline')
});