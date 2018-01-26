
var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var Usuario = require("../models/usuario");

var SEED = require ('../config/config').SEED;
var GOOGLE_CLIENT_ID =require ('../config/config').GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET =require ('../config/config').GOOGLE_CLIENT_SECRET;

const { OAuth2Client } = require('google-auth-library');
const audiance = GOOGLE_CLIENT_SECRET; // gapi client id
var gapiClient = new OAuth2Client(audiance,GOOGLE_CLIENT_SECRET, '');

var app = express();

//=====================================================
//  login google
//=====================================================

/*
const { OAuth2Client } = require('google-auth-library');
const idToken = ...; // the token received from the JS client
const audiance = "...apps.googleusercontent.com"; // gapi client id
var gapiClient = new OAuth2Client(audiance, '', '');
gapiClient.verifyIdToken({idToken, audiance}).then(login => {
    var payload = login.getPayload();
    var userId = payload.email;


*/

app.post('/google', (request,respuesta)=>{

  const idToken = request.body.token;
  gapiClient.verifyIdToken({idToken, audiance}).then(login => {
    var payload = login.getPayload();
    var userId = payload.email;

    Usuario.findOne({email:payload.email},(error,usuario)=>{
      if (error) {
        
            return respuesta.status(500).json({
              ok: false,
              mensaje: "error al buscar usuario - login",
              datos: error
            });
        
      }
      if(usuario){
        if(!usuario.google){
          return respuesta.status(500).json({
            ok: false,
            mensaje: "Debe usar su autentificación Normal"
          });

        }else{
              usuario.password=':)'

             var tooken = jwt.sign({ usuario: usuario}, SEED , {expiresIn:1440});

            return respuesta.status(200).json({
                ok: true,
                message: 'succes',
                toke:tooken,
                id:usuario.id
              });

        }
            //si el usuario no existe por correo
      }else{
        var user = new Usuario();
        user.nombre= payload.name;
        user.email=payload.email;
        user.password=':)';
        user.imagen=payload.picture;
        user.google = true;
        user.save((error,usuarioBd)=>{


          if(error){
            return respuesta.status(500).json({
              ok: false,
              mensaje: "error al guardar usuario -google",
              datos: error
            });
  
            
          }else{
            usuarioBd.password=':)'

            var tooken = jwt.sign({ usuario: usuarioBd}, SEED , {expiresIn:1440});

           return respuesta.status(200).json({
               ok: true,
               message: 'succes',
               toke:tooken,
               id:usuarioBd.id
             });

          }
        
        })

      }
    
    })


     
  }).catch(error=>{
    return respuesta.status(500).json({
      ok: false,
      mensaje: "token invalido",
    });
  });

  });












//=====================================================
//  Login normal
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

          var tooken = jwt.sign({ usuario: usuarioBd}, SEED , {expiresIn:1440});

            return respuesta.status(200).json({
                ok: true,
                message: 'succes',
                toke:tooken,
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
