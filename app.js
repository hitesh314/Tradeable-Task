const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes');
const userReferralRoutes = require('./routes/userReferralRoutes');
const makeConnection = require('./connection');

//defining the port.
const PORT = 1244;

//Starting the app at the port, url : /localhost:1234/
app.listen(PORT, console.log("Server has strated at PORT :" + PORT));

//Connecting the app to Mongodb database.
makeConnection();

// Defining body parsing for transervering json form data,
app.use(bodyParser.json());

//Sending the user register/login request to userRoutes.
app.use('/api', userRoutes);

//Sending the user refferal token generate/expire request to userRefferalRoutes.
app.use('/api/referral', userReferralRoutes);

module.exports = app;