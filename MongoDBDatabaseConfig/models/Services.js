const mongoose = require("mongoose")
const {MainDb} = require("../Db")
const {IdGenerator} = require("../../DevHelp/ID")
const Schema = mongoose.Schema;


const ServiceSchema = new Schema({
    Id:{
        type:String,
        required:true,
        default:"S-" +IdGenerator()
    },
    Name:{
        type:String,
        required:true
    },
    PgId:{
        type:String,
        required:true
    },
    Active:{
        type:Boolean,
        default:true
    },
    TimeBased:{
        type:Boolean
    }
},{timestamps:true})

module.exports = MainDb.model("Service",ServiceSchema)