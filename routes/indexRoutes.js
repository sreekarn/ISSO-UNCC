const express = require('express');
const router = express.Router();

const connectionController = require('../controllers/connectionController');
const indexController = require('../controllers/indexController');


router.get('/', indexController.index);
router.get('/index', indexController.index);
router.get('/newConnection/', connectionController.newConnection);
module.exports = router;