const express = require("express");
require("dotenv").config()

const app = express()


app.get("/",(req,res)=>{
    return res.json({
        status:200,
        message:"server is running fine"
    })
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port: ${process.env.PORT}`)
})