const { unsuccessfulResponse } = require("../DevHelp/Response")
const {verifyToken} = require("../DevHelp/Token")
const UserSchema = require("../MongoDBDatabaseConfig/models/Users")
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


    async GetCustomerPgId(req,res,next){
        try{
            const userType = req.userType
            if (userType == "Customer"){
                const UserInfo = await UserSchema({Id:req.userId})
                if(UserInfo.PgAssociation){
                    req.PgId = UserInfo.PgAssociation
                    return next()
                }
                return unsuccessfulResponse(req,res,405,"No Pg associated","No PGID",ProjectId)
            }
            return unsuccessfulResponse(req,res,407,"User Type is not Customer/Tenent","UserType mis Match",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,503,"Internal server Error",error,ProjectId)
        }
    }

    async VerifyCustomer(req,res,next){
        try{
            const userType = req.userType
            if (userType == "Customer"){
                return next()
            }
            return unsuccessfulResponse(req,res,403,"userType not allowed","User Type should be Customer",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,503,"Internal Server Error",error,ProjectId)
        }
    }
}

module.exports = new Authentication