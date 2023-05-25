const { unsuccessfulResponse } = require("../DevHelp/Response")
const {verifyToken} = require("../DevHelp/Token")
const Property = require("../MongoDBDatabaseConfig/models/Properties")
require("dotenv").config()
const ProjectId = process.env.Project_Id

class ServiceMiddleware{
    async verfiyServiceStatus(req,res,next){
        try{
            const userId = req.userId
            const {status} = req.body
            const statusList = ['Raised','In-Progress','Completed','On-Hold',"Not-Required"]
            const statusListEmployee = ['In-Progress','Completed','On-Hold']
            
            if(statusList.includes(status)){

                if(req.userType === "Customer" && status === "Not-Required"){
                    return next()
                }
                else{
                    if((req.userType === "PgEmployee" || req.userType === "PgOwner" )&& statusListEmployee.includes(status) ){
                        return next()
                    }
                }
                return unsuccessfulResponse(req,res,508,`${status} cannot be set by ${req.userType}`,`${status} cannot be set by ${req.userType}`,ProjectId)
            }
            return unsuccessfulResponse(req,res,507,"Invalid Status code","invalid status code",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,506,"Internal Server",error,ProjectId)
        }
    }
}

module.exports = new ServiceMiddleware