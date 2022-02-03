const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


// /api/user
router.get('/register/:jwt',userController.verify);
router.post('/register/',userController.register);

module.exports = router;