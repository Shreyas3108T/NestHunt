const mongoose = require("mongoose")
const {MainDb} = require("../Db")
const {IdGenerator} = require("../../DevHelp/ID")
const Schema = mongoose.Schema;


const BookingSchema = new Schema({
    Id:{
        type:String,
        required:true,
        default:"B-" + IdGenerator()
    },
    BookingType:{
        type:String,
        enum : ['View','Book'], //after shown the view request is turned false , while book type remains true until the person is a tenent
        required:true
    },
    BookingDate:{
        type:Date,
        required:true
    },
    UserId:{
        type:String,
        required:true
    },
    PgId:{
        type:String,
        required:true
    },
    RoomId:{
        type:String,
        required:true
    },
    Active:{
        type:Boolean,
        required:true,
        default:true
    },
    Approval:{
        type:String,
        required:true,
        enum:['Pending','Approved','Denied'],
        default:'Pending'
    }
},{timestamps:true})

module.exports =  MainDb.model("Booking",BookingSchema)