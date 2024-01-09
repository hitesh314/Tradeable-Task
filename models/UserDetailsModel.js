const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    firstname : {
      type : String,
      required : true,
    },
    lastname : {
      type : String,
      required : false,
      default : '',
    },
    username : {
      type : String,
      required : true,
      unique : true,
    },
    email: {
      type : String,
      required : true,
      unique : true,
    },
    phoneNumber : {
      type : String,
      unique : true,
    },
    password : {
      type : String,
      required : true,
      unique : false,
    },
    tokens : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'UserReferralsModel',
    }],
    wallet : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'UserWalletModel'
    }
  });

  const User = mongoose.model('User', userSchema);

  module.exports = User;