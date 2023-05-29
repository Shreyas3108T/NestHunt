const mongoose = require("mongoose")
const {MainDb} = require("../Db")
const {IdGenerator} = require("../../DevHelp/ID")
const Schema = mongoose.Schema;

const SerivceRequestSchema = new Schema({
    Id:{
        type:String,
        required:true,
        default:"SR-" +IdGenerator()
    },
    ServiceId:{
        type:String,
        required:true
    },
    UserId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['Raised','In-Progress','Completed','On-Hold',"Not-Required"],
        required:true,
        default:"Raised"
    },
    Active:{
        type:Boolean,
        required:true,
        default:true // make it inactive when completed or Not required
    },
    PgId:{
        type:String,
        reqired:true
    },
    lastUpdatedby:{
        type:String,
        required:true
    },
    s:{
        type:String,
        required:true,
        default:"empty"
    },
    RoomId:{
        type:String,
        require:true
    }
},{timestamps:true})


module.exports = MainDb.model('ServiceRequest',SerivceRequestSchema)
