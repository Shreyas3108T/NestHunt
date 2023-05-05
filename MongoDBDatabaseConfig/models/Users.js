const mongoose = require("mongoose")
const {MainDb} = require("../Db")
const Schema = mongoose.Schema;
const {IdGenerator} = require("../../DevHelp/ID")

const UserSchema = new Schema({
    Id:{
        type:String,
        unique:true,
        required:true,
        default:"U-" + IdGenerator()
    },
    Name:{
        type:String,
        Required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator: function(v){
                return  /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v)
            },
            message:props=>`${props.value} is not a valid email address`
        }    
    },
    PhoneNo:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(v){
                return /^[0-9]{10}$/.test(v);
            },
            message: props=>`${props.value} is not a valid phone number`
        }
    },
    Type:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    PgAssociation:{ //only for customers and Pg employees for PgOwner with multiple pgs will have to PG
        type:String
    }
      
},{timestamps:true}
)

module.exports = MainDb.model('User',UserSchema);