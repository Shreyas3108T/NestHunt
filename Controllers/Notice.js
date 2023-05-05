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

    async Notice(req,res){
        try{
            const UserId = req.UserId
            const UserInfo = await UserSchema.findOne({Id:UserId})
            if(UserInfo.PgAssociation){
                const Notices = await  Notice.find({PgId:UserInfo.PgAssociation,Active:true})
                return successfulResponse(res,"All the notices",Notices)
            }
            
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Intenal Server Error",error,ProjectId)
        }
    }

}

module.exports = new Notice