var express = require("express");
var app = express();

var Hospital = require("../models/hospitales");


var mdAutentication= require('../middlewares/autentificacion');

//=====================================================
//  obtener hospitales
//=====================================================
app.get("/", (request, respond, next) => {
  Hospital.find({}).exec((error, hospitales) => {
    //si hay error
    if (error) {
      return respuesta.status(500).json({
        ok: false,
        mensaje: "error cargando hospitales",
        errors: error
      });
    }
    //si todo salio bien
    respond.status(200).json({
      ok: true,
      hospitales: hospitales
    });
  });
  return;
});

//=====================================================
//  insertar hospital
//=====================================================
app.post("/", mdAutentication.verificaToken,(request, respuesta) => {
  var body = request.body;
  var hospital = new Hospital({
    nombre: body.nombre,
    img: body.img,
    usuario: body.usuario
  });

  hospital.save((error, hospitalGuardado) => {
    //si hay error
    if (error) {
      return respuesta.status(400).json({
        ok: false,
        mensaje: "error creando hospital",
        errors: error
      });
    }else{
               //si todo salio bien
    respuesta.status(201).json({
        ok: true,
        hospital: hospitalGuardado
        // usuarioToken:request.usuario
      });
    }
 
  });
});

//=====================================================
//  actualizar hospital
//=====================================================


app.put("/:id",mdAutentication.verificaToken, (request, respuesta) => {
  var id = request.params.id;
  var body = request.body;

  Hospital.findById(id, (error, hospital) => {
    if (error) {
      return respuesta.status(500).json({
        ok: false,
        mensaje: "error al buscar hsopital",
        errors: error
      });
    }
    if (!hospital) {
      return respuesta.status(400).json({
        ok: false,
        mensaje: "el hospital con el id " + id + " no existe",
        errors: { message: "no existe un hospital con ese id" }
      });
    }
    hospital.nombre = body.nombre;
    hospital.img = body.img;

    hospital.save((error, hospitalGuardado) => {
      if (error) {
        return respuesta.status(400).json({
          ok: false,
          mensaje: "Error al Actualizar hospital",
          errors: error
        });
      }
      respuesta.status(200).json({
        ok: true,
        hospital: hospital
      });
    });
  });
});

//=====================================================
//  Borrar hospital
//=====================================================

app.delete('/:id',mdAutentication.verificaToken,(request,respuesta)=>{
    var id = request.params.id;
  
    Hospital.findByIdAndRemove(id,(error,hospitalBorrado)=>{
         //si hay error
         if (error) {
          return respuesta.status(400).json({
            ok: false,
            mensaje: "error borrando hospital",
            errors: error
          });
        }
        //si no existe
        if(!hospitalBorrado){
          respuesta.status(201).json({
            ok: true,
            hospital: {messaege: 'El hospital con el id = '+id+ " no existe"}
          });
  
        }
           //si todo salio bien
      respuesta.status(200).json({
        ok: true,
        hospital: hospitalBorrado
      });
  
    })
  })

module.exports = app;
