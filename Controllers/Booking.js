const { IdGenerator } = require("../DevHelp/ID");
const { unsuccessfulResponse,successfulResponse } = require("../DevHelp/Response")
const NoticeSchema = require("../MongoDBDatabaseConfig/models/Notice")
const property = require("../MongoDBDatabaseConfig/models/Properties")
const UserSchema = require("../MongoDBDatabaseConfig/models/Users")
const BookingSchema = require("../MongoDBDatabaseConfig/models/Booking")
const Room = require("../MongoDBDatabaseConfig/models/Rooms")
const {validationResult} =  require("express-validator");
const ProjectId = process.env.ProjectId


class Booking{
    async ViewRequest(req,res){
        try{
            const {RoomId,PgId,date} = req.body
            const ValidationError = validationResult(req)
            if(! ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,403,"Validation Error",ValidationError,ProjectId)
            }
            const ViewDate = new Date(date) //"12/11/1981"
            const BookingId = "B-" + IdGenerator()
            const check = await BookingSchema.findOne({UserId:req.userId,PgId:PgId,RoomId:RoomId,Active:true})
            if (check){
                return successfulResponse(res,"you request is already raised",{BookingId:check.Id,approvalStatus:check.Approval})
            }
            const NewViewRequest = new BookingSchema({
                Id:BookingId,
                BookingType:"View",
                BookingDate:ViewDate,
                UserId:req.userId,
                PgId:PgId,
                RoomId:RoomId,
                Active:true
            })

            const SavedReq = await NewViewRequest.save()
            return successfulResponse(res,"Your request is pending",{BookingId:check.Id,approvalStatus:SavedReq.Approval})

        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }
}

module.exports = new Booking