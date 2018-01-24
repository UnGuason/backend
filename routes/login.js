var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

var SEED = require ('../config/config').SEED;


var app = express();
var Usuario = require("../models/usuario");

//=====================================================
//  Login
//=====================================================
app.post('/',(request,respuesta)=>{

   // obtiene el body de la petición
    var body = request.body;


    Usuario.findOne({email:body.email},(error,usuarioBd)=>{

             //si hay error
       if (error) {
        return respuesta.status(500).json({
          ok: false,
          mensaje: "error buscando  usuario",
          errors: error
        });
      }

      if(!usuarioBd){
        return respuesta.status(400).json({
            ok: false,
            mensaje: "no se encontro el usuario -email",
            errors: error
          });
        }
            //compara la contraseña que envia el usuario con la que jhay en la bd
          if(bcrypt.compareSync(body.password,usuarioBd.password)){
                       //si todo salio bien
                        //generar jwt

                        usuarioBd.password=':)'

     var ooken = jwt.sign({ usuario: usuarioBd}, SEED , {expiresIn:1440});

            return respuesta.status(200).json({
                ok: true,
                message: 'succes',
                toke:ooken,
                id:usuarioBd.id
              });
          }else{
           return respuesta.status(200).json({
                ok: true,
                message: 'email o contraseña incorrectos'
              });

          }

        
      
      

    });
          

});


module.exports = app;
