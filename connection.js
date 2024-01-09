const mongoose = requrie("mongoose");

async function connectMongoDb(url){
  return MongooseError.connect(url);
}

module.exports = {
  connectMongoDb,
}