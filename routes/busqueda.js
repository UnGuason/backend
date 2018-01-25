var express = require('express');
var Hospital = require("../models/hospitales");
var Medico = require("../models/medicos");
var Usuario = require("../models/usuario");




var app = express();





//=====================================================
//  Busqueda por colección
//=====================================================
app.get('/coleccion/:tabla/:busqueda',(request,respond)=>{

    var tabla= request.params.tabla;
    var busqueda= request.params.busqueda;
    var regex = new RegExp(busqueda, 'i' );
    switch (tabla) {
        case 'usuario':
             _funcion= buscaUsuario(busqueda,regex); 
            break;
            case 'medico':
            _funcion= buscaMedico(busqueda, regex);
            break;
            case 'hospital':
            _funcion= buscaHospital(busqueda,regex);
            break;
            default:
            return respond.status(400).json({
                ok:false,
                mensaje:'los parametros de busqueda sólo son : usuario, medicos y hospitales',
                error:{mensaje:'tipo de data colección no valido'}
    
            });
            break

    }

    _funcion.then(data=>{
        respond.status(200).json({
            ok:true,
            [tabla]:data

        })

    }).catch(error=>{

    });


    

});
//=====================================================
//  Busqueda general
//=====================================================

app.get('/todo/:busqueda', (request,respond, next) =>{
    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i' );

    Promise.all([buscaHospital(busqueda,regex),
                 buscaMedico(busqueda,regex),
                 buscaUsuario(busqueda,regex) ])
                 .then(respuesta=>{
                    respond.status(200).json({
                        ok:true,
                        hospitales: respuesta[0],
                        medicos:respuesta[1],
                        usuarios:respuesta[2]

                    })
            
                 }).catch(error=>{

                 });

 



    });

    //=====================================================
    //  Busqueda Hospital
    //=====================================================
    function buscaHospital(busqueda, regex){
        return new Promise((resolve,reject)=>{

            Hospital.find ({nombre:regex})
            .populate('usuario', 'nombre email')
            .exec(
            (error,hospiatales)=>{
                if (error){
                        reject('error al cargar hospitales', error);
                }else{
                    resolve(hospiatales);
                }
    
            });

        });
       
    }

    //=====================================================
    //  Busqueda Medico
    //=====================================================

    function buscaMedico(busqueda, regex){
        return new Promise((resolve,reject)=>{

            Medico.find ({nombre:regex})
            .populate('usuario', 'nombre email id')
            .populate('hsopital')

            .exec((error,medicos)=>{
                if (error){
                        reject('error al cargar medico', error);
                }else{
                    resolve(medicos);
                }
    
            });

        });
       
    }
    //=====================================================
    //  Busqueda Usuario
    //=====================================================

    function buscaUsuario(busqueda, regex){
        return new Promise((resolve,reject)=>{

            Usuario.find ({}, 'nombre id email')
            .or([{'nombre': regex} ,{'email':regex} ])
            .exec((error,usuario)=>{
                if(error){
                    reject('error al cargar usuario', error);
                    
                }else{
                    resolve(usuario);
                }

            })

        });
       
    }



    module.exports = app;