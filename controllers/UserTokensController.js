const express = require('express');
const User = require('../models/UserDetailsModel');
//for password generate using enrypt.
const validator = require('validator');
const exceptionHandler = require('../exception/errorHandler');
const controllerHelper = require('../Helper/ControllerMethods');
const UserReferrals = require('../models/UserReferralsModel');

//Controller method for login.
exports.generateToken = async (req, res) => {
try {
    const { userId } = req.body;
  
    // Check if username and password are provided
    if (!userId || userId === '') {
      return res.status(400).json({ error: 'User_Id is not provided.' });
    }
  
    //Get details of user with given userId
    const findUser = await User.findById(userId);

    if(findUser !== null)
    {
      //Creating a unique token using the crypto library.
      const uniqueToken = controllerHelper.generateUniqueToken();
      
      //Creating an object for the newly created unique token.
      const tokenCollectionGenerated = new UserReferrals({token : uniqueToken, timeIn: new Date(), attempts : 0, isValid : true, user : userId});
      
      //Saving the new userRefferals object in db.
      await tokenCollectionGenerated.save();
      
      //Pushing the token into user database.
      findUser.tokens.push(tokenCollectionGenerated);
      await findUser.save();

      res.status(201)
      .json(
        { message: "Token generated successfully",
        Token : tokenCollectionGenerated,
      });
    }
    else
    {
      res.status(400).json({message : "Invalud userId provided"});
    }
  }
  catch (error) {
    exceptionHandler(error, res);
  }
};

exports.expireToken = async(req, res) =>{
try{
  const requestTokenId = req.body.tokenId;

  if(!requestTokenId || requestTokenId.trim() === '')
  {
    return res.status(400).json({ error: 'Token is not provided.' });
  }
  //Finding the token associated with the token id.
  const findToken =  await UserReferrals.findById(requestTokenId);

  if(findToken)
  {
    //Setting the isValid proprty of token to be false.
    findToken.isValid = false;

    await findToken.save();

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

//This function gets an token as a input and then checks if the given token is valid and present in database.
exports.checkIfValidToken = async(token) =>
{
let result;
let validToken;
let message;
const getTokenDetails =   await UserReferrals.findById(token);

if(!getTokenDetails)// Checking if the token is null or empty.
{
  validToken = false;
  message = 'Invalid token provided';
}
else
{
  const millisecondsInOneDay = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  if(getTokenDetails.isValid === false) // Checking if the token is valid
  {
    validToken = false;
    message = 'The token is not valid anymore';
  }
  else if((Date.now() - getTokenDetails.timeIn)/millisecondsInOneDay >= 30)//If the token generation time is more than 30 days we declare the token as expired.
  {
    validToken = false;
    getTokenDetails.isValid = false;
    await getTokenDetails.save();

    message = 'The token has expired as it has passed 30 days of time period';
  }
  else
  {
    validToken = true;
    const totalAttempts = getTokenDetails.attempts;
    if(totalAttempts == 4)
    {
      getTokenDetails.attempts = 5;
      getTokenDetails.isValid = false;
    }

    message = 'The token provided is working fine';
  }
}

return {validToken, message};
}