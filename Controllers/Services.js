const ServiceSchema = require("../MongoDBDatabaseConfig/models/Services")
const Property = require("../MongoDBDatabaseConfig/models/Properties")
const { unsuccessfulResponse,successfulResponse } = require("../DevHelp/Response")
const { IdGenerator } = require("../DevHelp/ID")
const userSchema = require("../MongoDBDatabaseConfig/models/Users")
const ProjectId = process.env.ProjectId

class Service{
    async CreateService(req,res){
        try{
            const {ServiceName,TimeBased} = req.body
            const PgInfo = await Property.findOne({Owner:req.userId})
            if(!PgInfo){
                return unsuccessfulResponse(req,res,404,"No Pg found for the user",PgInfo,ProjectId)
            }
            const id = "S-" + IdGenerator()
            const newService = new ServiceSchema({
                Id:id,
                Name:ServiceName,
                PgId:PgInfo.Id,
                TimeBased:TimeBased
            })

            newService.save()
            const data = {
                ServiceId:id,
                Name:ServiceName,
                PgId:PgInfo.Id,
                PgName:PgInfo.Name
            }
            return successfulResponse(res,"serivce created successful",data)

        }
        catch(error){
            console.log(error)
            return unsuccessfulResponse(req,res,501,"Internal server error",error,ProjectId)
        }
    }
    async DeleteService(req,res){
        //delete
        try{
            
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server error",error,ProjectId)
        }
    }
    async deactivate(req,res){
        //make it inactive 
        try{
            const {ServiceId} = req.query
            const UpdateService = ServiceSchema.updateOne({Id:ServiceId},{Active:false})
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server Error",error,ProjectId)
        }
    }
    async ShowAllServices(req,res){
        try{
            if(req.userType === "PgOwner"){
                console.log('here')
                const PgInfo = await Property.findOne({Owner:req.userId})
                console.log(PgInfo) 
                const Services = await ServiceSchema.find({PgId:PgInfo.Id,Active:true})
                console.log(Services)
                return successfulResponse(res,"All the services served by you",Services)
            }
            else{
                if(req.userType === "Customer"){
                    const PgInfo = await userSchema.findOne({Id:req.userId})
                    const Services = await ServiceSchema.find({PgId:PgInfo.PgAssociation,Active:true})
                    return successfulResponse(res,"All the services served by your Pg",Services)
                }
            }
            
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server error",error,ProjectId)
        }
    }

}

module.exports = new Service