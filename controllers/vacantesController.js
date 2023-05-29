const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante')

exports.formularioNuevaVacante = (req, res) => {
  res.render('nueva-vacante', {
    nombrePagina: 'Nueva vacante',
    tagline: 'Llena el formulario y publica tu vacante',
    cerrarSesion: true,
    nombre: req.user.nombre
  })
}

//agregar las vacantes a la base de datos
exports.agregarVacante = async(req, res) => {
  const vacante = new Vacante(req.body)

  //usuario autor de la vacante
  vacante.autor = req.user._id;

  // crear arreglo de habilidades (skills)
  vacante.skills = req.body.skills.split(',');

  //almacenar en la base de datos
  const nuevaVacante = await vacante.save()

  //redireccionar
  res.redirect(`/vacantes/${nuevaVacante.url}`)
}

//muestra una vacante
exports.mostrarVacante = async(req, res, next) => {
  const vacante = await Vacante.findOne({url: req.params.url}).lean()

  //si no hay resultados
  if(!vacante) return next();

  res.render('vacante', {
    vacante,
    nombrePagina: vacante.titulo,
    barra: true
  })
}

exports.formEditarVacante = async(req, res, next) => {
  const vacante = await Vacante.findOne({url: req.params.url}).lean()
  if(!vacante) return next()

  res.render('editar-vacante', {
    vacante,
    nombrePagina: `Editar - ${vacante.titulo}`,
    cerrarSesion: true,
    nombre: req.user.nombre
  })
}

exports.editarVacante = async(req, res) => {
  const vacanteActualizada = req.body;
  vacanteActualizada.skills = req.body.skills.split(',');

  const vacante = await Vacante.findOneAndUpdate({url: req.params.url},
    vacanteActualizada, {
      new: true,
      runValidators: true
  })

  res.redirect(`/vacantes/${vacante.url}`)
}

//validar y sanitizar los campos de las nuevas vacantes
exports.validarVacante = (req, res, next) => {
  //sanitizar los campos
  req.sanitizeBody('titulo').escape()
  req.sanitizeBody('empresa').escape()
  req.sanitizeBody('ubicacion').escape()
  req.sanitizeBody('salario').escape()
  req.sanitizeBody('contrato').escape()
  req.sanitizeBody('skills').escape()

  //validar
  req.checkBody('titulo', 'Agregar un titulo a la vacante').notEmpty()
  req.checkBody('empresa', 'Agrega una empresa').notEmpty()
  req.checkBody('ubicacion', 'Agrega una ubicación').notEmpty()
  req.checkBody('contrato', 'Selecciona el tipo de contrato').notEmpty()
  req.checkBody('skills', 'Agrega al menos una habilidad').notEmpty()

  const errores = req.validationErrors()
  if(errores){
    //recargar la vista con los errores
    req.flash('error', errores.map(error => error.msg))
    res.render('nueva-vacante', {
      nombrePagina: 'Nueva vacante',
      tagline: 'Llena el formulario y publica tu vacante',
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash()
    })
    return
  }

  next()
}

exports.eliminarVacante = async(req, res) => {
  const { id } = req.params;

  const vacante = await Vacante.findById(id)

  if(verificarAutor(vacante, req.user)){
    // todo bien, si es el usuario
    vacante.deleteOne()
    res.status(200).send('Vacante eliminada correctamente')
  }else{
    // no permitido
    res.status(403).send('Error')
  }
  
}

const verificarAutor = (vacante = {}, usuario ={}) => {
  if(!vacante.autor.equals(usuario._id)){
    return false
  }
  return true
}