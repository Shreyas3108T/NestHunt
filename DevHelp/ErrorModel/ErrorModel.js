const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DevDb} = require("../../MongoDBDatabaseConfig/Db")
require("dotenv").config()

const uri = process.env.DATABASE_DEV_HELP;

const options = {
  useNewUrlParser: true
};



const ErrorSchema  = new Schema({
    ErrorId:{type:String,required:true,unique: true},
    ErrorRoute:{type:String},
    ErrorMsg:{type:String},
    ErrorStatusCode:{type:String},
    ErrorActive:{type:Boolean}

},
{ timestamps: true })

module.exports = DevDb.model('Error',ErrorSchema);