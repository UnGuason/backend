var express = require('express');
var fs =require ('fs');

var app = express();

//rutas
app.get('/:tipo/:img', (request,respond, next) =>{
    var tipo = request.params.tipo;
    var imagen = request.params.img;

    var path =`./uploads/${tipo}/${imagen}`;
    console.log(tipo+" "+imagen);
    fs.exists(path,existe=>{
        if(!existe){
        path ='./assets/no-img.jpg';
       }

       respond.sendFile(path, { root: '.' })

       
    });
  
    } );

    module.exports = app;