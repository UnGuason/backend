var express = require("express");
var app = express();

var Medico = require("../models/medicos");
var mdAutentication = require('../middlewares/autentificacion');


//=====================================================
//  obtener medicos
//=====================================================
app.get("/", (request, respond, next) => {

  var desde = request.query.desde || 0;
  desde=Number(desde);
  Medico.find({})
  .skip(desde)
  .limit(5)
  .populate('usuario' , 'nombre email')
  .populate('hospital')

  .exec((error, medicos) => {
    //si hay error
    if (error) {
      return respuesta.status(500).json({
        ok: false,
        mensaje: "error cargando medicos",
        errors: error
      });
    }
    //si todo salio bien
    Medico.count({},(error,conteo)=>{
      return  respond.status(200).json({
        ok: true,
        medicos: medicos,
        total:conteo
      });
    });
 
  });
});

//=====================================================
//  insertar medico
//=====================================================
app.post("/", mdAutentication.verificaToken,(request, respuesta) => {
  var body = request.body;
  var medico = new Medico({
   nombre: body.nombre,
    img: body.img,
    usuario: body.usuario,
    hospital:body.hospital
  });
  
  //si hay error
  medico.save((error, medicoGuardado) => {
    if (error) {
      return respuesta.status(400).json({
        ok: false,
        mensaje: "error creando medico",
        errors: error
      });
    } else {
      //si todo salio bien
      respuesta.status(201).json({
        ok: true,
        medico: medicoGuardado
        // usuarioToken:request.usuario
      });
    }
  });
});

//=====================================================
//  actualizar Medico
//=====================================================

app.put("/:id",mdAutentication.verificaToken, (request, respuesta) => {
  var id = request.params.id;
  var body = request.body;

  Medico.findById(id, (error, medico) => {
  if (error) {
      return respuesta.status(500).json({
        ok: false,
        mensaje: "error al buscar medico",
        errors: error
      });
    }
    if (!medico) {
    return respuesta.status(400).json({
        ok: false,
        mensaje: "el medico con el id " + id + " no existe",
        errors: { message: "no existe un medico con ese id" }
      });
    }
    medico.nombre = body.nombre;
    medico.img = body.img;
    medico.hospital = body.hospital

    medico.save((error, medicoGuardado) => {
      if (error) {
        return respuesta.status(400).json({
          ok: false,
          mensaje: "Error al Actualizar medico",
          errors: error
        });
      }
      respuesta.status(200).json({
        ok: true,
        medico: medicoGuardado
      });
    });
  });
});

//=====================================================
//  Borrar medico
//=====================================================

app.delete("/:id", mdAutentication.verificaToken , (request, respuesta) => {
  var id = request.params.id; 

  Medico.findByIdAndRemove(id, (error, medicoBorrado) => {
    //si hay error
    if (error) {
      return respuesta.status(400).json({
        ok: false,
        mensaje: "error borrando medico",
        errors: error
      });
    }
    //si no existe
    if (!medicoBorrado) {
      respuesta.status(201).json({
        ok: true,
        hospital: { messaege: "El medico con el id = " + id + " no existe" }
      });
    }
    //si todo salio bien
    respuesta.status(200).json({
      ok: true,
      medico: medicoBorrado
    });
  });
});

module.exports = app;
