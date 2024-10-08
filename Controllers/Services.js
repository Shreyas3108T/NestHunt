const ServiceSchema = require("../MongoDBDatabaseConfig/models/Services")
const Property = require("../MongoDBDatabaseConfig/models/Properties")
const { unsuccessfulResponse,successfulResponse } = require("../DevHelp/Response")
const { IdGenerator } = require("../DevHelp/ID")
const userSchema = require("../MongoDBDatabaseConfig/models/Users")
const SerivceRequestSchema = require("../MongoDBDatabaseConfig/models/ServiceRequest")
const ProjectId = process.env.ProjectId
const {validationResult} =  require("express-validator");
const RoomSchema = require("../MongoDBDatabaseConfig/models/Rooms")

class Service{

    //Services 
    async CreateService(req,res){
        try{
            const {ServiceName,TimeBased} = req.body
            const ValidationError = validationResult(req)
            if(! ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,465,"Validation Error",ValidationError,ProjectId)
            }
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

                const PgInfo = await Property.findOne({Owner:req.userId})
                const Services = await ServiceSchema.find({PgId:PgInfo.Id,Active:true})
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
    async ServiceDetail(req,res){
        try{
            const {ServiceId} = req.query
            const ServiceData = await ServiceSchema.findOne({Id:ServiceId})
            if(ServiceData){
                    return successfulResponse(res,"Here the Service Data",ServiceData)
            }
            return unsuccessfulResponse(req,res,404,"no service found","no service with this id",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }
    async ShowAllServicesByPgId(req,res){
        try{
            const {PgId} = req.query
            const ValidationError = validationResult(req)
            if(! ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,465,"Validation Error",ValidationError,ProjectId)
            }
            const Services = await ServiceSchema.find({PgId:PgId,Active:true})
            return successfulResponse(res,"All the services served",Services)
            
            
            
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server error",error,ProjectId)
        }
    }

    //Service Request 

    async CreateServiceRequest(req,res){
        try{
            const {ServiceId} = req.body
            const ValidationError = validationResult(req)
            if(! ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,465,"Validation Error",ValidationError,ProjectId)
            }
            const ServiceData = await ServiceSchema.findOne({Id:ServiceId})
            const UserInfo = await userSchema.findOne({Id:req.userId})
            const RoomId = await RoomSchema.findOne({OccupantId:req.userId})
            if (ServiceData){
                if(UserInfo){
                    if(ServiceData.PgId === UserInfo.PgAssociation){
                        const ServiceRequestId = "SR-" +IdGenerator()
                        const ServiceRequest = new SerivceRequestSchema({
                            Id:ServiceRequestId,
                            ServiceId:ServiceId,
                            UserId:req.userId,
                            PgId:ServiceData.PgId,
                            lastUpdatedby:req.userId,
                            RoomId:RoomId.RoomId
                        })
                        ServiceRequest.save()
                        return successfulResponse(res,"Service Request Created Successfully",ServiceRequest)
                    }
                    return unsuccessfulResponse(req,res,405,"Your Pg doesn't serve this request","PgId mis match for",ProjectId)
                }
                return unsuccessfulResponse(req,res,406,"No user Data found ","empty userInfo",ProjectId)

            }
            return unsuccessfulResponse(req,res,406,"No user Data found ","empty userInfo",ProjectId)

        }
        catch(error){

            return unsuccessfulResponse(req,res,501,"Internal server error",error,ProjectId)
        }
    }
    async ChangeSRStatus(req,res){
        try{
            const {status,ServiceId} = req.body
            const ValidationError = validationResult(req)
            if(! ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,465,"Validation Error",ValidationError,ProjectId)
            }
            const ServiceRequestData = await SerivceRequestSchema.findOne({Id:ServiceId,Active:true})
            if (status === "Completed" || status === "Not-Required"){
                const UpdatedSr = await SerivceRequestSchema.updateOne({Id:ServiceId},{status:status,Active:false})
                return successfulResponse(res,`Service Request Updated to ${status}`,UpdatedSr)
            }
            const UpdatedSr = await SerivceRequestSchema.updateOne({Id:ServiceId},{status:status})
            return successfulResponse(res,`Service Request Updated to ${status}`,UpdatedSr)
            
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }
    async ShowAllSR(req,res){
     try{
        const {OnlyActive} = req.query
        const ValidationError = validationResult(req)
            if(! ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,465,"Validation Error",ValidationError,ProjectId)
            }
        if(OnlyActive === true){
            if(req.userType === "Customer"){
                const SRs = await SerivceRequestSchema.find({UserId:req.userId,Active:true})
                return successfulResponse(res,"All the active Service Requests",SRs)
            }
            if(req.userType === "PgOwner"){
                const userInfo = await userSchema.findOne({Id:req.userId})
                const SRs = await SerivceRequestSchema.find({PgId:userInfo.PgAssociation,Active:true})
                return successfulResponse(res,"All the active Service Requests",SRs)
            }
            if(req.userType === "PgEmployee"){
                const SRs = await SerivceRequestSchema.find({assignedTo:req.userId,Active:true})
                return successfulResponse(res,"All the active Service Requests",SRs)
            }
            return unsuccessfulResponse(req,res,601,"Not possible user has to be of one type","user type impossible",ProjectId)

        }
        else{
            if(req.userType === "Customer"){
                const SRs = await SerivceRequestSchema.find({UserId:req.userId})
                return successfulResponse(res,"All the Service Requests",SRs)
            }
            if(req.userType === "PgOwner"){
                const userInfo = await userSchema.findOne({Id:req.userId})
                const SRs = await SerivceRequestSchema.find({PgId:userInfo.PgAssociation})
                return successfulResponse(res,"All the Service Requests",SRs)
            }
            if(req.userType === "PgEmployee"){
                const SRs = await SerivceRequestSchema.find({assignedTo:req.userId})
                return successfulResponse(res,"All the  Service Requests",SRs)
            }
            return unsuccessfulResponse(req,res,601,"Not possible user has to be of one type","user type impossible",ProjectId)
        }
        
        
     }
     catch(error){
        return unsuccessfulResponse(req,res,501,"Internal server Error",error,ProjectId)
     } 
    }
    async ServiceRequestDetail(req,res){
        try{
            const {ServiceRequestId} = req.query
            const SRdetail = await SerivceRequestSchema.findOne({Id:ServiceRequestId})
            const userInfo = await userSchema.findOne({Id:req.userId})
            if ((SRdetail) && (userInfo.Type === "PgOwner" && userInfo.PgAssociation === SRdetail.PgId) ||(SRdetail.UserId === userInfo.Id || SRdetail.assignedTo === userInfo.Id)){
                return successfulResponse(res,"Service Reuqest Details",SRdetail)  
            }
            return unsuccessfulResponse(req,res,403,"access not available","Not assoicated with the request in any way",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server error")
        }
    }
    async AssignTask(req,res){
        try{
            const {ServiceRequestId,EmployeeId} = req.body
            const SR = await SerivceRequestSchema.findOne({Id:ServiceRequestId})
            const PgOwner = await userSchema.findOne({Id:req.userId})
            const Employee = await userSchema.findOne({Id:EmployeeId,Type:"PgEmployee"})
            if(!SR){
                return unsuccessfulResponse(req,res,404,"No Service Request Found","No SR",ProjectId)
            }
            if(!Employee){
                return unsuccessfulResponse(req,res,404,"No Employee found ","No Employee",ProjectId)
            }
            if(Employee.PgAssociation === SR.PgId && PgOwner.PgAssociation === SR.PgId){
                const UpdateSR = await SerivceRequestSchema.updateOne({Id:ServiceRequestId},{assignedTo:EmployeeId})
                return successfulResponse(res,`Task assigned to ${Employee.Name}`,"Updated")
            }
            return unsuccessfulResponse(req,res,405,"Mismatch in PgId","PgId mismatch",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"internal Server error assignTask",error,ProjectId)
        }
    }
    

}

module.exports = new Service