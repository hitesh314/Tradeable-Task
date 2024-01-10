const express = require('express');
const User = require('../models/UserDetailsModel');
const UserWallet = require('../models/UserWalletModel');
const UserReferrals = require('../models/UserReferralsModel');
const bcrypt = require('bcryptjs');
//for password generate using enrypt.
const validator = require('validator');
const exceptionHandler = require('../exception/errorHandler');
const userTokenController = require('./UserTokensController');

exports.register = async (req, res) => {
  try{
    const {
       firstname, lastname, username, email, phoneNumber,tokenId} = req.body;

    //Creating a hash value for the password.
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    //Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address format' });
    }
    
    //Validate phone number format
    if (!validator.isMobilePhone(phoneNumber))
    {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

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

    if(tokenId !== undefined)
    {
      const tokenValidation = await userTokenController.checkIfValidToken(tokenId);
      if(tokenValidation.validToken === false)
      {
        return res.status(400).json(tokenValidation.message);
      }
      else
      {
        //Finding the token, user and user wallet for given tokenId
        const getTokenDetails =   await UserReferrals.findById(tokenId);
        const refferedByUser = await User.findById(getTokenDetails.user);
        const refferedUserWallet = await UserWallet.findById(refferedByUser.wallet);

        //Incrementing the user balance by 5000 and adding the token into the user wallet.
        refferedUserWallet.balance += 5000;
        refferedUserWallet.tokensUsed.push(getTokenDetails);

        //Saving the changes to database.
        await newUser.save();
        await userWallet.save();
        await refferedByUser.save();
        await refferedUserWallet.save();
        res.status(201).json({ message: "The user has been registered successfully and refferal has been activated" });
      }
    }
    else
    {
      await newUser.save();
      await userWallet.save();
      res.status(201).json({ message: "The user has been registered successfully" });
    }
  }
  catch(error){
    exceptionHandler(error, res);
  }
};

//Controller method for login.
exports.login = async (req, res) => {
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