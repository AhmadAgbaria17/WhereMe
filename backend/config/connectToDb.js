const mongoose = require("mongoose");

module.exports = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_CLOUD_URI);
    console.log('Mongo DB Connected...');
  }catch(error){
    console.log(`MongoDB connection error: ${error.message}`);
  }
}