const { IdGenerator } = require("../DevHelp/ID");
const { unsuccessfulResponse,successfulResponse } = require("../DevHelp/Response")
const NoticeSchema = require("../MongoDBDatabaseConfig/models/Notice")
const property = require("../MongoDBDatabaseConfig/models/Properties")
const UserSchema = require("../MongoDBDatabaseConfig/models/Users")
const BookingSchema = require("../MongoDBDatabaseConfig/models/Booking")
const Room = require("../MongoDBDatabaseConfig/models/Rooms")
const Property = require("../MongoDBDatabaseConfig/models/Properties")
const {validationResult} =  require("express-validator");
const ProjectId = process.env.ProjectId


class Booking{
    async ViewRequest(req,res){
        try{
            const {RoomId,PgId,date} = req.body
            const ValidationError = validationResult(req)
            if(! ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,465,"Validation Error",ValidationError,ProjectId)
            }
            const ViewDate = new Date(date) //"12/11/1981"
            const BookingId = "B-" + IdGenerator()
            const check = await BookingSchema.findOne({UserId:req.userId,PgId:PgId,RoomId:RoomId,Active:true})
            if (check){
                return successfulResponse(res,"you request is already raised",{BookingId:check.Id,approvalStatus:check.Approval,BookingType:'View'})
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
            return successfulResponse(res,"Your request is pending",{BookingId:SavedReq.Id,approvalStatus:SavedReq.Approval})

        }
        catch(error){
            console.log(error);
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }

    async BookRequest(req,res){
        try{
            const {RoomId,PgId,date} = req.body
            const ValidationError = validationResult(req)
            if(! ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,403,"Validation Error",ValidationError,ProjectId)
            }
            const BookDate = new Date(date) //"12/11/1981"
            const BookingId = "B-" + IdGenerator()
            const check = await BookingSchema.findOne({UserId:req.userId,PgId:PgId,RoomId:RoomId,Active:true})
            if (check){
                return successfulResponse(res,"you request is already raised",{BookingId:check.Id,approvalStatus:check.Approval,BookingType:'Book'})
            }
            const NewViewRequest = new BookingSchema({
                Id:BookingId,
                BookingType:"Book",
                BookingDate:BookDate,
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

    async ApproveRequest(req,res){
        try{
            const {BookingId,approvalStatus} = req.body
            const ValidationError = validationResult(req)
            if (!ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,401,"Validation Error",error,ProjectId)
            }

            const checkBookingRequest = await BookingSchema.findOne({Id:BookingId})
            if(!checkBookingRequest){
                return unsuccessfulResponse(req,res,404,"Booking request not found","No booking Id found",ProjectId)
            }

            const PgId = checkBookingRequest.PgId
            const PgInfo = await property.findOne({Id:PgId})
            if (!(req.userId === PgInfo.Owner)){
                return unsuccessfulResponse(req,res,403,"Access Denied","User and owner Id didn't match",ProjectId)
            }
            if (checkBookingRequest.Active === false){
                return unsuccessfulResponse(req,res,411,"The request has already been addresed",{Status:checkBookingRequest.Approval},ProjectId)
            }
            const Approval = approvalStatus === 1 ? "Approved" : "Denied";
            const UpdateBookingRequest = await BookingSchema.updateOne({Id:BookingId},{Approval:Approval,Active:false}) 
            if (checkBookingRequest.BookingType == "Book"){
                const updatedRoom = await Room.updateOne({RoomId:checkBookingRequest.RoomId},{OccupantId:checkBookingRequest.UserId,Occupancy:true})
                const userUpdate = await UserSchema.updateOne({Id:checkBookingRequest.UserId},{PgAssociation:checkBookingRequest.PgId})
            }
            
            return successfulResponse(res,`Booking Successfully ${Approval}`,UpdateBookingRequest)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server Error",error,ProjectId)
        }
    }

    async AllBooking(req,res){
        try{
            const {active} = req.query;
            const PGs = await property.find({Owner:req.userId})
            const BookingReqelements = await Promise.all(PGs.map(async element => {
                return await BookingSchema.find({ PgId: element.Id,Active:active});
            }));

            const BookingElements = Array.from(BookingReqelements).filter(element => element !== null);
            if (BookingElements.length >0){ //12/03
                return successfulResponse(res,"All the active booking Request",BookingElements)
            }
            return successfulResponse(res,"No active bookings found",{})
            
            
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server error",error,ProjectId)
        }
    }

    async BookingInfo(req,res){
        try{
            const {BookingId} = req.query
            const ValidationError = validationResult(req)
            if(!ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,411,"Validation Error",ValidationError,ProjectId)
            }
            const BookingInfo = await BookingSchema.findOne({Id:BookingId})
            if(!BookingInfo){
                return unsuccessfulResponse(req,res,404,"Booking Info not found","BookingId not matching",ProjectId)
            }
            const userInfo = await UserSchema.findOne({Id:req.userId})
            const PgInfo = await property.find({Owner:req.userId}).select({"Id":1})
            const idArray = PgInfo.map(obj => obj.Id);
            if(userInfo.Type === "Customer"){
                if(BookingInfo.UserId === req.userId){
                    return successfulResponse(res,"Booking information ",BookingInfo)
                }
                return unsuccessfulResponse(req,res,403,"user doesn't have access","Booking Info user and login user dont match",ProjectId)
            }
            if(userInfo.Type === "PgOwner"){
                if(idArray.includes(BookingInfo.PgId)){
                    return successfulResponse(res,"Booking information ",BookingInfo)
                }
                return unsuccessfulResponse(req,res,403,"user doesn't have access","Booking Info user and login user dont match",ProjectId)
            }
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server Error",error,ProjectId)
        }
    }

    async AllTenents(req,res){
        try{
            const PgInfo = await property.find({Owner:req.userId}).select({"Id":1})
            const idArray = PgInfo.map(obj => obj.Id);
            if(idArray.length == 0){
                return unsuccessfulResponse(req,res,402,"No Pg Found","Pg not found",ProjectId)
            }
            const BookingReqelements = await Promise.all(idArray.map(async element => {
                return await BookingSchema.findOne({ PgId: element,Approval:"Approved"});
            }));
            const BookingElements = Array.from(BookingReqelements).filter(element => element !== null);
            const Tenents = (BookingElements.map( element=>{
                return element.UserId
            }))
            return successfulResponse(res,"Here are all The tenents",Tenents)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server Error",error,ProjectId)
        }
    }

    async Bookinghistory(req,res){
        try {
            const bookings = await BookingSchema.find({ UserId: req.userId });
        
            if (bookings.length === 0) {
              return successfulResponse(res, "No Booking History", []);
            }
        
            const enrichedBookings = []; // Create a new array for modified bookings
        
            for (const booking of bookings) {
              const pg = await Property.findOne({ Id: booking.PgId });
              let roomName = "None";
              try{
                const room = await Room.findOne({RoomId: booking.RoomId});
                // console.log(room)
                roomName = room.RoomName;
              }
              catch(error){
                roomName = booking.RoomId;
              }
              const enrichedBooking = { ...booking, PgName: pg.Name,RoomName:roomName }; // Create a new object
              enrichedBookings.push(enrichedBooking); // Add the enriched object to the new array
            }
        
            return successfulResponse(res, "Booking history", enrichedBookings);
          } catch (error) {
            console.log(error);
            return unsuccessfulResponse(req, res, 501, "Internal server Error", error);
          }
    }
}

module.exports = new Booking