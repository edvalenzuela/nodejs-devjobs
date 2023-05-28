const passport = require('passport')
const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante')

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/administracion',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios'
})

// revisar si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next) => {
  //revisar el usuario
  if(req.isAuthenticated()){
    return next(); //estan autenticados
  }

  //redireccionar
  res.redirect('/iniciar-sesion')
}

exports.mostrarPanel = async(req, res) => {

  //consultar el usuario autenticado
  const vacantes = await Vacante.find({autor:req.user._id}).lean()

  res.render('administracion', {
    nombrePagina: 'Panel de administración',
    tagline: 'Crea y administra tus vacantes desde aquí',
    cerrarSesion: true,
    nombre: req.user.nombre,
    vacantes
  })
}

exports.cerrarSesion = (req, res) => {
  req.logout(err => {
    if(err) {
        return next(err);
    }
    req.flash('correcto', 'cerraste sesión correctamente')
    return res.redirect('/iniciar-sesion')
  });
}