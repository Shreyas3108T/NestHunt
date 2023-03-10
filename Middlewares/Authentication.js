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
}

module.exports = new Authentication