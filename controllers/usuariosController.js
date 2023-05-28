const mongoose = require('mongoose')
const Usuarios = mongoose.model('Usuarios')

exports.formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    nombrePagina: 'Crea tu cuenta en devJobs',
    tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
  })
}

exports.validarRegistro = (req, res, next) => {

  //sanitizar
  req.sanitizeBody('nombre').escape()
  req.sanitizeBody('email').escape()
  req.sanitizeBody('password').escape()
  req.sanitizeBody('confirmar').escape()

  //validar
  req.checkBody('nombre', 'El nombre es obligatorio').notEmpty()
  req.checkBody('email', 'El email debe ser valido').isEmail()
  req.checkBody('password', 'El password no puede ir vacio').notEmpty()
  req.checkBody('confirmar', 'Confirmar password no puede ir vacio').notEmpty()
  req.checkBody('confirmar', 'El password es diferente').equals(req.body.password)

  const errores = req.validationErrors()
  if(errores){
    //si hay errores
    req.flash('error', errores.map( item => item.msg ))
    res.render('crear-cuenta', {
      nombrePagina: 'Crea tu cuenta en devJobs',
      tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
      mensajes: req.flash()
    })
    return
  }

  //si toda la validación es correcta
  next()
}

exports.crearUsuario = async(req, res) => {
  //crear el usuario
  const usuario = new Usuarios(req.body)
  try {
    await usuario.save()
    res.redirect('/iniciar-sesion')
  } catch (error) {
    req.flash('error', error)
    res.redirect('/crear-cuenta')
  }
}

// formulario para iniciar sesion
exports.formIniciarSesion = async(req, res) => {
  res.render('iniciar-sesion', {
    nombrePagina: 'Iniciar sesión devJobs'
  })
}

//form editar el perfil
exports.formEditarPerfil = (req, res) => {
  res.render('editar-perfil', {
    nombrePagina: 'Edita tu perfil en devJobs',
    usuario: req.user.toObject(),
    cerrarSesion: true,
    nombre: req.user.nombre
  })
}

//guardar cambios editar perfil
exports.editarPerfil = async(req, res) => {
  const usuario = await Usuarios.findById(req.user._id).lean()
  
  usuario.nombre = req.body.nombre;
  usuario.email = req.body.email;
  if(req.body.password){
    usuario.password = req.body.password
  }

  // TODO: no funciona el guardar
  await usuario.save()

  req.flash('correcto', 'cambios guardados')

  //redirect
  res.redirect('/administracion')
}

//sanitizar y validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
  //sanitizar
  req.sanitizeBody('nombre').escape()
  req.sanitizeBody('email').escape()

  if(req.body.password){
    req.sanitizeBody('password').escape()
  }

  //validar
  req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty()
  req.checkBody('email', 'El correo no puede ir vacio').notEmpty()

  const errores = req.validationErrors();

  if(errores){
    req.flash('error', errores.map(error => error.msg))
    res.render('editar-perfil', {
      nombrePagina: 'Edita tu perfil en devJobs',
      usuario: req.user.toObject(),
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash()
    })
    return
  }

  next()
}