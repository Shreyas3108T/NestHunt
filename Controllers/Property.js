const { IdGenerator } = require("../DevHelp/ID");
const { unsuccessfulResponse,successfulResponse } = require("../DevHelp/Response")
const Property = require("../MongoDBDatabaseConfig/models/Properties")
const Room = require("../MongoDBDatabaseConfig/models/Rooms")
const {validationResult} =  require("express-validator");
const ProjectId = process.env.ProjectId
class properity{

    async CreateProperty(req,res){
        // it should be created by an Property owner acconut only
        try{
            // in the middleware there should be user authenticated and it should be the a PG owner account 
            const {Name,longitude,latitude,street,city,state,zip,Pgtype} = req.body
            const ValidatonError = validationResult(req)
            if(!ValidatonError.isEmpty()){
                return unsuccessfulResponse(req,res,422,"Validation Error",ValidatonError,ProjectId)
            }
            //put a validation here if the user has the exact same address already stored return an error 
            const newProperty = new Property({
                Id: "P-" + IdGenerator(),
                Owner:req.userId,
                Name:Name,
                address:{
                    street:street,
                    city:city,
                    state:state,
                    zip:zip,
                    location:{
                        type:'Point',
                        coordinates:[longitude, latitude]
                    }
                },
                Pgtype:Pgtype,
                foodAvailability:true,
                recreation:true,
                gym:true
            })
            try{
                const savedproperty = await newProperty.save();
                return successfulResponse(res,"Property created",savedproperty)
            }
            catch(error){
                console.log(error)
                return unsuccessfulResponse(req,res,503,"Some Problem with saving data onto the database",error,ProjectId)
                
            }
        }
        catch(error){
            console.log(error)
            return unsuccessfulResponse(req,res,501,"internal server error", error)
        }
    }
 
    async GetProperty(req,res){
        try{
            const {PropertyId} = req.query
            const PropertyData = await Property.findOne({Id:PropertyId})
            if (!PropertyData){
                return unsuccessfulResponse(req,res,404,"No property Found","empty data",ProjectId)
            }
            return successfulResponse(res,"Property Data",PropertyData)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server error",error,ProjectId)
        }
    }

    async EditProperty(req,res){
        try{
            const {Id} = req.body // add validation For this Id such that the Id is a property of a property and not some random 
            //could
            //validate Id of user and then get the property Id and then edit the properties of property 

        }
        catch(Error){
            return unsuccessfulResponse(req,res,501,"Internal server error",Error,ProjectId)
        }

    }

    async Search(req,res){
        const {type,Longitude,Latitude,Pgtype,foodAvailability,recreation,gym} = req.query;
        let distance 
        if (type == 1){ //1 being target location
            distance =req.query.distance // in meters
        }
        if (type == 2){ // area 
            distance = 3000
        }
        try{
            const targetLocation = {
                type: 'Point',
                coordinates: [Longitude, Latitude] // e.g. [77.62048, 12.93447]
                };
            const properties = await Property.find({
                "address.location": {
                    $nearSphere: {
                        $geometry: targetLocation,
                        $maxDistance: distance
                        }
                }
            }).sort({ 
                Pgtype: Pgtype,
                foodAvailability: foodAvailability,
                recreation: recreation,
                gym: gym
            }).exec();
    


            return successfulResponse(res,"here is the PG data",{dataCount:properties.length,data:properties})
        }
        catch(error){
            console.log(error)
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }

    async addOneRoom(req,res){
        try{
            const {RoomName} = req.body
            const ValidatonError = validationResult(req)
            if(!ValidatonError.isEmpty()){
                return unsuccessfulResponse(req,res,422,"Validation Error",ValidatonError,ProjectId)
            }

            const PG = await Property.findOne({Owner:req.userId})
            const PgId = PG.Id
            const IdRoom = PgId + "@" + "R" + "-" + IdGenerator()
            const NewRoom = new Room({
                RoomId:IdRoom,
                RoomName:RoomName,
                PgId:PgId
            })
            try{
                const SavedRoom = await NewRoom.save()
                const updateProperty = await Property.findOneAndUpdate(
                    {Id:PgId},{$inc:{totalRooms:1}}
                )
                return successfulResponse(res,"Room created successfully",{RoomId:IdRoom})
            }
            catch(error){
                console.log(error)
                return unsuccessfulResponse(req,res,504,"Error during the saving of data",error,ProjectId)
            }
        }
        catch(error){
            console.log(error)
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }

    async AddMultipleRooms(req,res){ // of same type 
        try{
            const ValidatonError = validationResult(req)
            if(!ValidatonError.isEmpty()){
                return unsuccessfulResponse(req,res,422,"Validation Error",ValidatonError,ProjectId)
            }
            const {PgId,NoOfRooms} = req.body
            const RoomIds = []
            const RoomIdsError = []
            for(let i = 0; i < NoOfRooms; i++){
                const IdRoom = PgId + "@" + "R" + "-" + IdGenerator()
                const NewRoom = new Room({
                    RoomId:IdRoom,
                    PgId:PgId
                })
                try{
                    const SavedRoom = await NewRoom.save()
                    RoomIds.push(IdRoom)
                    //return successfulResponse(res,"Room created successfully",{RoomId:IdRoom})
                }
                catch(error){
                    RoomIdsError.push({err:error,RoomId:IdRoom})
                    // return unsuccessfulResponse(req,res,504,"Error during the saving of data",error,ProjectId)
                }
            }
            if (RoomIdsError.length === 0){
                const updateProperty = await Property.findOneAndUpdate(
                    {Id:PgId},{$inc:{totalRooms:NoOfRooms}}
                )
                return successfulResponse(res,"All rooms are created",RoomIds)
                
            }
            return unsuccessfulResponse(req,res,504,"Some Error while saving",{RoomIds,RoomIdsError},ProjectId)

        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }

    async GetRooms(req,res){
        try{
            const {PgId} = req.query
            const RoomsList = await Room.find({PgId:PgId})
            return successfulResponse(res,"All the rooms",RoomsList)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server Error",error,ProjectId)
        }
    }

    async GetRoomsAvailable(req,res){
        try{
            const {PgId} = req.query
            const RoomsList = await Room.find({PgId:PgId,Occupancy:false})
            return successfulResponse(res,"All the rooms Available",RoomsList)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server Error",error,ProjectId)
        }
    }

    async GetPgIdByUserId(req,res){
        try{
            // req.userId

            const PG = await Property.findOne({Owner:req.userId})
            if(!PG){
                return unsuccessfulResponse(req,res,203,"No Pg Created by the user,prompt to create new Pg",PG,ProjectId)
            }
            return successfulResponse(res,"Pg data",PG)

        }
        catch(error){
            console.log(error)
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }
}

module.exports = new properity

// const newProperty = new Property({
//   Owner: 'John Smith',
//   Name: 'Beautiful House',
//   address: {
//     street: '123 Main St',
//     city: 'Anytown',
//     state: 'CA',
//     zip: '12345',
//     location: {
//       type: 'Point',
//       coordinates: [-118.123456, 34.123456]
//     }
//   }
// });