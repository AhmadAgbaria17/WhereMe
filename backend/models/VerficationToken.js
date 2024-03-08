const mongooose = require("mongoose");


//Verfication Token Schema
const VerficationTokenSchema = new mongooose.Schema({
  userId:{
    type:mongooose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
  },
  token:{
    type:String,
    required:true,
  },
},{
  timestamps: true, //Saves created at and updated at as dates 
})


//Verfication Token Model
const VerficationToken = mongooose.model("VerficationToken",VerficationTokenSchema)







module.exports = VerficationToken;
  
