const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userWalletSchema = new schema(
  {
    balance : {
      type : Number,
      required : true,
      default : 0,
    },
    tokensUsed : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'UserReferralsModel'
    }],
    user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'UserDetailsModel'
    },
  });

  const userWallet = mongoose.model('userWallet', userWalletSchema);

  module.exports = userWallet;