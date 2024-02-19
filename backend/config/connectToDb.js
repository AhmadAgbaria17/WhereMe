const mongoose = require("mongoose");

module.exports = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_DB_CONNECTION);
    console.log('Mongo DB Connected...');
  }catch(error){
    console.log(`MongoDB connection error: ${error.message}`);
  }
}