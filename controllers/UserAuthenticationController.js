const express = require('express');
const User = require('../models/UserDetailsModel');
const UserWallet = require('../models/UserWalletModel');
const UserReferrals = require('../models/UserReferralsModel');
const bcrypt = require('bcryptjs');
//for password generate using enrypt.
const validator = require('validator');
const exceptionHandler = require('../exception/errorHandler');

const register = async (req, res) => {
  try{
    const {
       firstname, lastname, username, email, phoneNumber,token} = req.body;

    //Creating a hash value for the password.
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    //Validate email format
    if (!validator.isEmail(email)) {
      console.log("Incorrect email address");
      return res.status(400).json({ message: 'Invalid email address format' });
    }
    
    // Validate phone number format
    // if (validator.isMobilePhone(phoneNumber, { strictMode: false }) === false)
    // {
    //   console.log("Incorrect email address");
    //   return res.status(400).json({ message: 'Invalid phone number format' });
    // }

    // Checking if the referral token is valid.
    const newUser = new User({
        firstname,
        lastname,
        username,
        email,
        phoneNumber,
        password,
        
    });
    const userWallet =  new UserWallet({ balance: 0, user: newUser._id });
    newUser.wallet = userWallet._id;

    if(token !== undefined)
    {
      const tokenValidation = await checkIfValidToken(token);
      if(tokenValidation.validToken === false)
      {
        return res.status(400).json(tokenValidation.message);
      }
      else
      {
        const getTokenDetails =   await UserReferrals.findById(token);

        const refferedByUser = await User.findById(getTokenDetails.user);
        const refferedUserWallet = await UserWallet.findById(refferedByUser.wallet);
        console.log(refferedByUser.wallet);


        refferedUserWallet.balance += 5000;
        refferedUserWallet.tokensUsed.push(getTokenDetails);

        refferedUserWallet.save();
        refferedByUser.save();
      }
    }

    //Create the new user object.
    
    //Saving the new user into database.
    const savedUser = await newUser.save();
    userWallet.save();
    res.status(201).json({ message: "The user has been registered successfully" });
  }
  catch(error){
    res.status(402).json({ message: error });
  }
};

//Controller method for login.
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Both username and password are required.' });
    }

    //Get details of user with given username
    const findUser = await User.findOne({ username });

    if (findUser) {
      if (bcrypt.compareSync(password, findUser.password)) {
        const findUserWallet = await UserWallet.findById(findUser.wallet);
        const findUserTokens = await UserReferrals.findById(findUser.UserReferrals);
        res.status(201).json({
          message: "Login successful",
          result: {
            username: findUser.username,
            name : findUser.firstname + " " + findUser.lastname,
            email : findUser.email,
            UserWalletBalance : findUserWallet?.balance,
            UserTokens : findUserTokens,
          },
        });
      } else {
        res.status(400).json({
          message: 'Invalid password for username: ' + username,
        });
      }
    } else {
      res.status(400).json({
        message: 'User does not exist',
      });
    }
  } catch (error) {
    exceptionHandler(error, res);
  }
};

async function checkIfValidToken(token)
{
  let result;
  let validToken;
  let message;
  const getTokenDetails =   await UserReferrals.findById(token);

  if(!getTokenDetails)
  {
    validToken = false;
    message = 'Invalid token provided';
  }
  else
  {
    const millisecondsInOneDay = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    if(getTokenDetails.isValid === false)
    {
      validToken = false;
      message = 'The token is not valid anymore';
    }
    else if((Date.now() - getTokenDetails.timeIn)/millisecondsInOneDay >= 30)
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

module.exports = {register, login};