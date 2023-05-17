const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')
const vacantesController = require('../controllers/vacantesController')

module.exports = () => {
  router.get('/', homeController.mostrarTrabajos)

  //crear vacantes
  router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante)
  router.post('/vacantes/nueva', vacantesController.agregarVacante)

  //mostrar vacante
  router.get('/vacantes/:url', vacantesController.mostrarVacante)

  //editar vacante
  router.get('/vacantes/editar/:url', vacantesController.formEditarVacante)
  router.post('/vacantes/editar/:url', vacantesController.editarVacante)

  return router
}