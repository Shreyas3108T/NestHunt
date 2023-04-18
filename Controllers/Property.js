const { unsuccessfulResponse,successfulResponse } = require("../DevHelp/Response")
const Property = require("../MongoDBDatabaseConfig/models/Properties")
const {validationResult} =  require("express-validator");
const ProjectId = process.env.ProjectId
class properity{

    async CreateProperty(req,res){
        // it should be created by an Property owner acconut only
        try{
            // in the middleware there should be user authenticated and it should be the a PG owner account 
            const {Name,longitude,latitude,street,city,state,zip} = req.body
            const ValidatonError = validationResult(req)
            if(!ValidatonError.isEmpty()){
                return unsuccessfulResponse(req,res,422,"Validation Error",ValidatonError,ProjectId)
            }
            //put a validation here if the user has the exact same address already stored return an error 
            const newProperty = new Property({
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
                }
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
        const {type} = req.query;
        let distance 
        const {latitude,longitude} = req.body;
        if (type == 1){ //1 being target location
            distance = req.body.distance // in meters
        }
    
        try{
            const nearestPGs = await Property.aggregate([
                {
                    $geoNear:{
                        near:{
                            type:'Point',
                            coordinates:[latitude,longitude]
                        },
                        distanceField:'distance',
                        spherical:true,
                        maxDistance:distance
                    }
                },
                {
                    $sort:{
                        distance:1 
                    }
                }
            ])

            return successfulResponse(res,"here is the PG data",nearestPGs)
        }
        catch(error){
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