const { IdGenerator } = require("../DevHelp/ID");
const { unsuccessfulResponse,successfulResponse } = require("../DevHelp/Response")
const NoticeSchema = require("../MongoDBDatabaseConfig/models/Notice")
const property = require("../MongoDBDatabaseConfig/models/Properties")
const UserSchema = require("../MongoDBDatabaseConfig/models/Users")
const Room = require("../MongoDBDatabaseConfig/models/Rooms")
const {validationResult} =  require("express-validator");
const ProjectId = process.env.ProjectId

class Notice{
    async CreateNotice(req,res){
        try{
            const userId = req.userId
            const validate = validationResult(req)
            if (!validate.isEmpty()){
                return unsuccessfulResponse(req,res,411,"Validation Problenm",validate,ProjectId)
            }
            const {Msg} = req.body
            const PgData = await property.findOne({Owner:userId})
            const NoticeId = "N-" + IdGenerator()
            const NewNotice = new NoticeSchema({
                Id:NoticeId,
                NoticeMsg:Msg,
                PgId:PgData.Id
            })
            NewNotice.save()
            return successfulResponse(res,"Notice Posted Successfully",{Id:NoticeId,msg:Msg})
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server Error",error,ProjectId)
        }
    }
    async GetNotice(req,res){
        try{
            const UserId = req.userId
            const {OnlyActive} = req.query
            const UserInfo = await UserSchema.findOne({Id:UserId})
            if(UserInfo.PgAssociation){
                const Notices = await  NoticeSchema.find({PgId:UserInfo.PgAssociation,Active:OnlyActive})
                return successfulResponse(res,"All the notices",Notices)
            }
            
        }
        catch(error){
            console.log(error)
            return unsuccessfulResponse(req,res,501,"Intenal Server Error",error,ProjectId)
        }
    }
    async DeactivateNotice(req,res){
        try{
            const {NoticeId} = req.body
            const UserInfo = await UserSchema.findOne({Id:req.userId})
            const Notice = await NoticeSchema.findOne({Id:NoticeId})
            if(UserInfo.PgAssociation === Notice.PgId){
                const update = await NoticeSchema.updateOne({Id:NoticeId},{Active:false})
                return successfulResponse(res,"Notice removed successfully",{})
            }
            return unsuccessfulResponse(req,res,402,"PgId dont match","PgId dont match",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server error",error,ProjectId)
        }
    }
}

module.exports = new Notice