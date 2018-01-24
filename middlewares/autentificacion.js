var jwt = require('jsonwebtoken');
var SEED = require ('../config/config').SEED;

//=====================================================
//  verificacion token
//=====================================================

exports.verificaToken = function(request,respuesta,next){

    var token = request.query.token;
    jwt.verify(token,SEED, (error,decoded)=>{
       //si hay error
       if (error) {
        return respuesta.status(401).json({
          ok: false,
          mensaje: "token Incorrecto",
          errors: error
        });
      }

      request.usuario=decoded.usuario;
      next();
     
  
    });


}


  
  
  
