const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require('cors');

const {MainDb}= require("./MongoDBDatabaseConfig/Db")
const {unsuccessfulResponse,successfulResponse}= require("./DevHelp/Response")
require("dotenv").config()

const ProjectId = process.env.ProjectId

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const Authentication = require("./Routes/Authentication")
const Property = require("./Routes/Property")
const Notice = require("./Routes/Notice")
const Booking = require("./Routes/Booking")
const Service = require("./Routes/Services")

app.use("/v1",Authentication)
app.use("/v1",Property)
app.use("/v1",Notice)
app.use("/v1",Booking)
app.use("/v1",Service)

app.get("/",(req,res)=>{
    if (MainDb.readyState !==1){
        return  unsuccessfulResponse(req,res,504,"internal server error","The database connection failed",ProjectId)
    }

    return successfulResponse(res,"server is running fine",{})
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port: ${process.env.PORT}`)
})