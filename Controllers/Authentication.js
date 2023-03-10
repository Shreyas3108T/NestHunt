const { unsuccessfulResponse, successfulResponse } = require("../DevHelp/Response")
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt")
const User = require("../MongoDBDatabaseConfig/models/Users")
const {TokenGenerator,verifyToken} = require("../DevHelp/Token")
require("dotenv").config()
const ProjectId = process.env.Project_Id

class Authentication{

    // ReqValidation(req,res){
    //     const ValidatonError = validationResult(req)
    //     if(!ValidatonError.isEmpty()){
    //         return unsuccessfulResponse(req,res,422,"Validation Error",ValidatonError,ProjectId)
    //     }
    // }
    async SignUp(req,res){
        try{
            const {Name,Email,Password,PhoneNo,Type} = req.body //Type we dont get from the user.
            const ValidatonError = validationResult(req)
            let saveduser
            // check with email and phone number weather or not user already exsits 
            if(!ValidatonError.isEmpty()){
                return unsuccessfulResponse(req,res,422,"Validation Error",ValidatonError,ProjectId)
            }
            
            const password = await bcrypt.hash(Password, 10);

            const UserObject = {
                    Name:Name,
                    Email:Email,
                    PhoneNo:PhoneNo,
                    Type:Type,
                    Password:password
            } 
            
            

            const newUser = new User(UserObject)
            try{
                saveduser = await newUser.save();
            }
            catch(error){
                return unsuccessfulResponse(req,res,503,"internal server Error",error,ProjectId)
            }

            const newToken = TokenGenerator({Id:saveduser.Id})
            return successfulResponse(res,"User Created Successfully",{JWTToken:newToken})

        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server Error",error,ProjectId)
        }
    }

    async SignIn(req,res){
        try{
            const {Email,Password} = req.body
            const ValidationError = validationResult(req)

            if(!ValidationError.isEmpty()){
                return unsuccessfulResponse(req,res,503,"internal serve Error",error,ProjectId)
            }
            const user = await User.findOne({Email:Email})
            if (!user){
                return unsuccessfulResponse(req,res,404,"User not found","User not found",ProjectId) //devide the unsuccessful errors into different types that they are 
            }
            
            const match = await bcrypt.compare(Password, user.Password);
            if (match){
                const token = TokenGenerator({Id:user.Id})
                return successfulResponse(res,"User signIn successful",{JWTToken:token})
            }
            else{
                return unsuccessfulResponse(req,res,401,"Incorrect Password","Password Incorrect",ProjectId)
            }
        }
        catch(error){
            console.error(error)
            return unsuccessfulResponse(req,res,501,"internal server Error",error,ProjectId)
        }
    }

    async Authtest(req,res){
        try{
            return successfulResponse(res,"Authenticated user",{user:req.userId})
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
        }
    }
}

module.exports = new Authentication