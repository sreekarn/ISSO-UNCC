const express = require('express');
const connectionController = require('../controllers/connectionController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const{validateId, validateStory,validationResult} = require('../middlewares/validator');

const router = express.Router();

router.get('/', connectionController.getAllConnections);

router.get('/newConnection', isLoggedIn, connectionController.newConnection);

router.get('/savedConnections',isLoggedIn, connectionController.getSavedConnections);

router.post('/', isLoggedIn, validateStory, validationResult, connectionController.create);

router.get('/:id', validateId,connectionController.show);

router.get('/:id/update', validateId, isLoggedIn, isAuthor, connectionController.edit);

router.put('/:id', validateId, isLoggedIn, isAuthor, validateStory,validationResult, connectionController.update);

router.delete('/:id', validateId, isLoggedIn, isAuthor,connectionController.delete);

module.exports = router;