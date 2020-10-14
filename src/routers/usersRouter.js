const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');

//router
router.get('/', userController.getUser);
router.get('/login', userController.loginUser);
router.post('/signup', userController.signUp);

module.exports = router;