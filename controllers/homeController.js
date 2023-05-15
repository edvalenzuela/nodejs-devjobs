exports.mostrarTrabajos = (req, res) => {

  res.render('home', {
    nombrePagina: 'devJobs',
    tagline: 'Encuentra y pública trabajos para desarrolladores web',
    barra: true,
    boton: true
  })
}