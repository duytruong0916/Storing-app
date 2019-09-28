const express = require('express');
const router = express.Router()
const  UserController = require('../controllers/user')
// Register request
router.post('/user/register',UserController.RegisterUser)
// Authentiticate request
router.post('/user/authenticate', UserController.AuthenticateUser);
module.exports = router;
