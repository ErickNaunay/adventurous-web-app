const express = require('express');
const router = express.Router();
//requerir controladores

const ctrChapter = require('../controllers/chapter');
const ctrStory = require('../controllers/story');

//Definir rutas para las acciones definidas para la colección users
router
    .route('/stories')
    .post(ctrStory.create) // Crea un usuario
    .get(ctrStory.find); // Lee todos los usuarios

router
    .route('/stories/:id')
    .get(ctrStory.findOne) // Lee un usuario específico
    .put(ctrStory.update) // Actualiza un usuario
    .delete(ctrStory.remove); // Borra un usuario

module.exports = router;