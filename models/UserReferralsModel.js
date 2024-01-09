const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userReferralSchema = new schema(
  {
    token : {
      type : String,
      required : true,
      unique : true,
    },
    timeIn : {
      type : Date,
      required : false,
      default : '',
    },
    attempts : {
      type : Number,
      required : true,
      default : 0,
    },
    isValid : {
      type : Boolean,
      required : true,
      default : true,
    },
    user : {type : mongoose.Schema.Types.ObjectId, ref : 'UserDetailsModel'},
  });

  const UserReferrals = mongoose.model('UserReferrals', userReferralSchema);

  module.exports = UserReferrals;