const { unsuccessfulResponse } = require("../DevHelp/Response")
const {verifyToken} = require("../DevHelp/Token")
const Property = require("../MongoDBDatabaseConfig/models/Properties")
require("dotenv").config()
const ProjectId = process.env.Project_Id

class PropertyMiddleware{
    async verfiyPGwithUser(req,res,next){
        try{
            const {PgId} = req.body
            const FindProperty = await Property.findOne({Id:PgId,Owner:req.userId})
            if (!FindProperty){
                return unsuccessfulResponse(req,res,506,"Owner and PG dont match","no match",ProjectId)
            }
            console.log(FindProperty)
            next()
        }
        catch(error){
            console.log(error)
            return unsuccessfulResponse(req,res,509,"Internal server error",error,ProjectId)
        }
    }
}

module.exports = new PropertyMiddleware