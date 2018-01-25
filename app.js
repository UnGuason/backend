
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


//inicializar Variables
var app= express();


//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//=====================================================
//  Rutas
//=====================================================
var  appRoutes = require('./routes/app');
var  usuarioRoutes = require('./routes/usuario');
var  loginRoutes = require('./routes/login');
var  hospitalesRoutes = require('./routes/hospitales');
var  medicosRoutes = require('./routes/medicos');
var  busquedaRoutes = require('./routes/busqueda');
var  uploadsRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');




//conexion a la case de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error,response) => {
if(error) throw error;
console.log('Base de Datos: \x1b[32m%s\x1b[0m',' 0nline');

});

//server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



//rutas
app.use('/usuario',usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospitales', hospitalesRoutes);
app.use('/medicos', medicosRoutes);
app.use('/busqueda', busquedaRoutes);
app.use ('/uploads',uploadsRoutes);
app.use ('/imagenes',imagenesRoutes)

app.use('/', appRoutes);





//Escuchar peticiones
app.listen(3000 ,()=>{
    console.log('express sercer puerto 3000: \x1b[32m%s\x1b[0m',' 0nline')
});