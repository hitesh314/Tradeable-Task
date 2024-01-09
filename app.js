const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes');

//defining the port.
const PORT = process.env.PORT || 1244;

//Starting the app at the port, url : /localhost:1234/
app.listen(PORT, console.log("Server has strated at PORT :" + PORT));

// MongoDb connection is done here using mongoose orm.
mongoose
  .connect('mongodb://127.0.0.1:27017/Tradeable') 
  .then(() => console.log("MongoDB Connected")) 
  .catch((err) => console.log("Error connecting MongoDB", err));

// Defining body parsing for transervering json form data,
app.use(bodyParser.json());

//Sending the request to userRoutes.
app.use('/api', userRoutes);

module.exports = app;