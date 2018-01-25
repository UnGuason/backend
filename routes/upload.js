var express = require("express");
const fileUpload = require("express-fileupload");
var Usuario = require("../models/usuario");
var Medico = require("../models/medicos");
var Hospital = require("../models/hospitales");
var fs = require("fs");

var app = express();
app.use(fileUpload());

//rutas
app.put("/:tipo/:id", (request, res, next) => {
  var tipo = request.params.tipo;
  var id = request.params.id;

  var tiposColeccion = ["usuarios", "medicos", "hospitales"];
  if (tiposColeccion.indexOf(tipo) === -1) {
    return res.status(400).json({
      ok: false,
      mensaje: `tipo de coleecion no soportado . ${tipo}`,
      error: {
        message: "La coleccion tiene que ser medicos ,usuarios o hospitales"
      }
    });
  }

  if (!request.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "no se recibieron archivos",
      error: { message: "Debe seleccionar una imagen" }
    });
  }
  //obtener nombre del archivo
  var archivo = request.files.imagen;
  var nombreCortado = archivo.name.split(".");
  var extension = nombreCortado[nombreCortado.length - 1];

  //extensionse que aceptamos
  var extensionesValidas = ["png", "jpg", "gif"];
  if (extensionesValidas.indexOf(extension) === -1) {
    return res.status(403).json({
      ok: false,
      mensaje: "extension no soportada",
      error: { message: "Debe seleccionar una imagen con extension valida" }
    });
  }

  //nombre del archivo
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
  //mover archivo a un path
  var path = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(path, error => {
    if (error) {
      return res.status(403).json({
        ok: false,
        mensaje: "error al mover archivo",
        error: error
      });
    }
  });
  subirtPorTipo(tipo, id, nombreArchivo, res);

 
});

function subirtPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (error, usuario) => {
      var pathViejo = "./uploads/usuarios/" + usuario.imagen;
      //si existe el path lo elimina
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      usuario.imagen= nombreArchivo;
      usuario.save((error,usuarioAcutalizado)=>{
        return  res.status(200).json({
           ok: true,
           mensaje:'imagen de usuario actualizada',
           nombre: usuarioAcutalizado

    });

      })


    });
  }
  if (tipo === "medicos") {
    Medico.findById(id, (error, medico) => {
      var pathViejo = "./uploads/medicos/" + medico.imagen;
      //si existe el path lo elimina
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      medico.imagen= nombreArchivo;
      medico.save((error,medicoActualizado)=>{
        return  res.status(200).json({
           ok: true,
           mensaje:'imagen de medico actualizada',
           nombre: medicoActualizado

    });

      })


    });

  }
  if (tipo === "hospitales") {
    Hospital.findById(id, (error, hospital) => {
      var pathViejo = "./uploads/medicos/" + hospital.imagen;
      //si existe el path lo elimina
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      medico.hospital= nombreArchivo;
      medico.save((error,hospitalActualizado)=>{
        return  res.status(200).json({
           ok: true,
           mensaje:'imagen de hospital actualizada',
           nombre: hospitalActualizado

    });

      })


    });

  }
}

module.exports = app;
