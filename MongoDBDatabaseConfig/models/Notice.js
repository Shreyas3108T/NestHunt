const mongoose = require("mongoose")
const {MainDb} = require("../Db")
const {IdGenerator} = require("../../DevHelp/ID")
const Schema = mongoose.Schema;

const NoticeSchema = new Schema({
    Id:{
        type:String,
        required:true,
        default:"N-" + IdGenerator()
    },
    NoticeMsg:{
        type:String,
        required:true
    },
    PgId:{
        type:String,
        required:true
    },
    Active:{
        type:Boolean,
        required:true,
        default:true

    }
    
},{timestamps:true})


module.exports = MainDb.model('Notice',NoticeSchema)
