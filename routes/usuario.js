var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

var mdAutentication = require('../middlewares/autentificacion');
var app = express();
var Usuario = require("../models/usuario");

//rutas

//=====================================================
//  Obtener todos los usuarios
//=====================================================
app.get("/", (request, respond, next) => {
  Usuario.find({}, "nombre email img role").exec((error, usuario) => {
    //si hay error
    if (error) {
      return respuesta.status(500).json({
        ok: false,
        mensaje: "error carcando usuarios",
        errors: error
      });
    }
    //si todo salio bien
    respond.status(200).json({
      ok: true,
      usuarios: usuario
    });
  });
  return
});


//=====================================================
//  Actualizar  usuario
//=====================================================

app.put("/:id",mdAutentication.verificaToken, (request, respuesta) => {
  var id = request.params.id;
  var body = request.body;

  Usuario.findById(id, (error, usuario) => {
    if (error) {
      return respuesta.status(500).json({
        ok: false,
        mensaje: "error al buscar usuario",
        errors: error
      });
    }
    if (!usuario) {
      return respuesta.status(400).json({
        ok: false,
        mensaje: "el usuario con el id " + id + " no existe",
        errors: { message: "no existe un usuario con ese id" }
      });
    }
    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((error, usuarioGuardado) => {
      if (error) {
        return respuesta.status(400).json({
          ok: false,
          mensaje: "Error al Actualizar usuario",
          errors: error
        });
      }
      usuarioGuardado.password=' :) ';
      respuesta.status(200).json({
        ok: true,
        usuarios: usuarioGuardado
      });
    });
  });
});

//=====================================================
//  Crear un nuevo usuario
//=====================================================

app.post("/",mdAutentication.verificaToken, (request, respuesta) => {
  var body = request.body;
  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((error, usuarioGuardado) => {
    //si hay error
    if (error) {
      return respuesta.status(400).json({
        ok: false,
        mensaje: "error creando usuario",
        errors: error
      });
    }
    //si todo salio bien
    respuesta.status(201).json({
      ok: true,
      usuarios: usuarioGuardado,
      usuarioToken:request.usuario
    });
  });
});


//=====================================================
//  Borrrar un usuario
//=====================================================


app.delete('/:id',mdAutentication.verificaToken,(request,respuesta)=>{
  var id = request.params.id;

  Usuario.findByIdAndRemove(id,(error,usuarioBorrado)=>{
       //si hay error
       if (error) {
        return respuesta.status(400).json({
          ok: false,
          mensaje: "error creando usuario",
          errors: error
        });
      }
      //si no existe
      if(!usuarioBorrado){
        respuesta.status(201).json({
          ok: true,
          usuario: {messaege: 'El usuario con el id = '+id+ " no existe"}
        });

      }
         //si todo salio bien
    respuesta.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });

  })
})
module.exports = app;
