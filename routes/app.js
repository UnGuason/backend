var express = require('express');

var app = express();

//rutas
app.get('/', (request,respond, next) =>{
    respond.status(403).json({
        ok:true,
        mensaje:'peticion correcrta'
    })
    
    } );

    module.exports = app;