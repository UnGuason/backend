
// Requires
var express = require('express');
var mongoose = require('mongoose');

//inicializar Variables
var app= express();


//conexion a la case de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error,response) => {
if(error) throw error;
console.log('Base de Datos: \x1b[32m%s\x1b[0m',' 0nline');

});


//rutas
app.get('/', (request,respond, next) =>{
respond.status(403).json({
    ok:true,
    mensaje:'peticion correcrta'
})

} );

//Escuchar peticiones
app.listen(3000 ,()=>{
    console.log('express sercer puerto 3000: \x1b[32m%s\x1b[0m',' 0nline')
});