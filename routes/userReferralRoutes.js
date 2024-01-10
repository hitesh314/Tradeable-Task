const express = require('express');
const router = express.Router();
const userReferralRoutes = require('../controllers/UserTokensController')

//Generate user referral token and save in user database, sending request to controllers/UserTokensController.generateToken.
router.post('/generate',
    userReferralRoutes.generateToken)

//Expire user referral token and update in user database, sending request to controllers/UserTokensController.generateToken.
router.post('/expire',
    userReferralRoutes.expireToken)
    
module.exports = router;