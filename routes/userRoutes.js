const express = require('express');
const router = express.Router();
const userAuthRoutes = require('../controllers/UserAuthenticationController');

//Register post request to the controller via router, sending request to controllers.UserAuthenticationController.register.
router.post('/register',
    userAuthRoutes.register);

//Login post request to the controller via router, sending request to controllers.UserAuthenticationController.login.
router.post('/login',
    userAuthRoutes.login);
    
module.exports = router;