const express = require('express');
const router = express.Router();
const userAuthRoutes = require('../controllers/UserAuthenticationController');
const userReferralRoutes = require('../controllers/UserTokensController')

//Register post request to the controller via router, sending request to controllers.UserAuthenticationController.register.
router.post('/register',
    userAuthRoutes.register);

//Login post request to the controller via router, sending request to controllers.UserAuthenticationController.login.
router.post('/login',
    userAuthRoutes.login);

//Generate user referral token and save in user database, sending request to controllers/UserTokensController.generateToken.
router.post('/referral/generate',
    userReferralRoutes.generateToken)

//Expire user referral token and update in user database, sending request to controllers/UserTokensController.generateToken.
router.post('/referral/expire',
    userReferralRoutes.expireToken)
    
module.exports = router;