const mongoose = require("mongoose")
const {MainDb} = require("../Db")
const {IdGenerator} = require("../../DevHelp/ID")
const Schema = mongoose.Schema;



const locationSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], //should be in the fromat [longitude, latitude]
      required: true
    }
  });
  
  const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    location: locationSchema
  });

  
const PropertySchema = new Schema({
    Id:{
        type:String,
        unique:true,
        required:true,
        default:"P-" + IdGenerator()
    },
    Owner:{
        type:String,
        required:true,
    },
    Name:{
        type:String,
        required:true
    },
    address:addressSchema

    
},{timestamps:true})


module.exports = MainDb.model('Property',PropertySchema);