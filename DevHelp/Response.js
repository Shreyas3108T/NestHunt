const errormodel = require("./ErrorModel/ErrorModel")
const {IdGenerator} = require("./ID")

exports.unsuccessfulResponse = async(req,res,statusCode,message,error,ProjectId)=>{

       
        const newerror = new errormodel({
            ErrorId:ProjectId +"."+ "E-" + IdGenerator(),
            ErrorRoute:req.route.path,
            ErrorMsg:`${error}`,
            ErrorStatusCode:statusCode,
            ErrorActive:true
        })
    
        
            newerror.save(); //only save the internal errors 
        

    
    

    return res.status(statusCode).json({
        status:statusCode,
        success:false,
        message:message,
        data:{error}
    })
}

exports.successfulResponse = async(res,message,data)=>{

    return res.status(200).json({
        status:200,
        success:true,
        message:message,
        data:data
    })
}