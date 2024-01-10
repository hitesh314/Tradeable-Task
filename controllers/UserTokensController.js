const express = require('express');
const User = require('../models/UserDetailsModel');
//for password generate using enrypt.
const validator = require('validator');
const exceptionHandler = require('../exception/errorHandler');
const crypto = require('crypto');
const UserReferrals = require('../models/UserReferralsModel');

//Controller method for login.
const generateToken = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if username and password are provided
    if (!userId || userId === '') {
      return res.status(400).json({ error: 'User_Id is not provided.' });
    }
    
    //Get details of user with given userId
    const findUser = await User.findOne(userId);

    //Creating a unique token using the crypto library.
    const uniqueToken = generateUniqueToken();

    //Creating an object for the newly created unique token.
    const tokenCollectionGenerated = new UserReferrals({token : uniqueToken, timeIn: new Date(), attempts : 0, isValid : true, user : userId});

    //Saving the new userRefferals object in db.
    tokenCollectionGenerated.save();

    console.log('Saved new token for user ' + findUser.username);

    findUser.tokens.push(tokenCollectionGenerated);
    await findUser.save();
    res.status(201)
        .json(
        { message: "Token generated successfully",
          Token : uniqueToken,
        });
  } catch (error) {
    exceptionHandler(error, res);
  }
};

const expireToken = async(req, res) =>{
  try{
    const requestTokenId = req.body.tokenId;

    if(!requestTokenId || requestTokenId.trim() === '')
    {
      return res.status(400).json({ error: 'Token is not provided.' });
    }

    const findToken =  await UserReferrals.findById(requestTokenId);
    if(findToken)
    {
      findToken.isValid = false;
      findToken.save();
      res.status(201)
      .json(
        { message: "Token declared as expired",
        Token : findToken.token,
      });
    }
    else
    {
      return res.status(400).json({message: "Invalid tokenId provided"});
    }
  }
  catch(error)
  {
    exceptionHandler(error, res);
  }
};

function generateUniqueToken() {
  const currentTimestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const uniqueToken = crypto.createHash('sha256').update(currentTimestamp + randomBytes).digest('hex');
  return uniqueToken;
}

module.exports = {generateToken, expireToken};