const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authentication = require('../middlewares/authentication');


// /api/user
router.get('/verify/:jwt',userController.verify);
router.post('/register/',userController.register);
router.post('/updatepin',authentication,userController.updatePin);

module.exports = router;