const mongoose = require("mongoose")
const {MainDb} = require("../Db")
const {IdGenerator} = require("../../DevHelp/ID")
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({
    RoomId:{
        type:String,
        required:true //make room id = Pgid +R+idgen()
    },
    RoomName:{
        type:String,
        required:true
    },
    PgId:{
        type:String,
        required:true 
    },
    Occupancy:{
        type:Boolean,
        required:true,
        default:false
    },
    OccupantId:{
        type:String,
        default:null
    },
    amenities:{
        type:Object // this includes things like floor number ,bathroom etc , even the whole gym and all will come under this eventually 
    },
    nextAvailable:{
        type:Date,
        default:null
    }
},{timestamps:true})

module.exports = MainDb.model('Room',RoomSchema)