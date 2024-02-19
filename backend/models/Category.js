const mongooose = require("mongoose");
const Joi = require("joi");


//Catgory Schema
const CatgorySchema = new mongooose.Schema({
  user:{
    type:mongooose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
  },
  title:{
    type:String,
    required:true,
    trim:true,
  },
},{
  timestamps: true, //Saves created at and updated at as dates 
})


//Category Model
const Category = mongooose.model("Category",CatgorySchema)



//validate create Catgory
function validateCreateCategory(obj){
  const schema=Joi.object({ 
      title: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}




module.exports ={
  Category,
  validateCreateCategory,
}