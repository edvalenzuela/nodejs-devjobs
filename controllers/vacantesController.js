const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante')

exports.formularioNuevaVacante = (req, res) => {
  res.render('nueva-vacante', {
    nombrePagina: 'Nueva vacante',
    tagline: 'Llena el formulario y publica tu vacante'
  })
}

//agregar las vacantes a la base de datos
exports.agregarVacante = async(req, res) => {
  const vacante = new Vacante(req.body)

  // crear arreglo de habilidades (skills)
  vacante.skills = req.body.skills.split(',');

  //almacenar en la base de datos
  const nuevaVacante = await vacante.save()

  //redireccionar
  res.redirect(`/vacantes/${nuevaVacante.url}`)
}