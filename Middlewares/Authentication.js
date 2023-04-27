const { unsuccessfulResponse } = require("../DevHelp/Response")
const {verifyToken} = require("../DevHelp/Token")
require("dotenv").config()
const ProjectId = process.env.Project_Id


class Authentication{
    async verfiyLogin(req,res,next){
        try{
            const tokenFull = req.headers.authorization
            if(!tokenFull){
                return unsuccessfulResponse(req,res,411,"No authorization token found","no token found",ProjectId)
            }

            const token = tokenFull.split(" ")[1]
            try{
                const userInfo = verifyToken(token)
                req.userId = userInfo.Id
                req.userType = userInfo.userType
                console.log("verifyLogin=",req.userId)
                next()
            }
            catch(err){
                return unsuccessfulResponse(req,res,412,"invalid token",err,ProjectId)
            }   
        }
        catch(error){
            return unsuccessfulResponse(req,res,511,"Internal server error",error,ProjectId)
        }
    }

    async verfiyPgOwner(req,res,next){
        try{
            const userType = req.userType
            if (userType == "PgOwner"){
                next()
                return 
            }
            return unsuccessfulResponse(req,res,403,"The user is not authorized to handle this request","userType Wrong",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,512,"Internal server error",error,ProjectId)
        }
    }

    async VerifyPgCustomer(req,res,next){
        try{
            const userType = req.userType
            if (userType == "Customer"){
                //Code not complete 
                next()
            }
        }
        catch(error){
            unsuccessfulResponse(req,res,503,"Internal server Error,error in Pg customer Verification",error,ProjectId)
        }
    }
}

module.exports = new Authentication