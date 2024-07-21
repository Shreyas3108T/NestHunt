const { unsuccessfulResponse, successfulResponse } = require("../DevHelp/Response")
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt")
const User = require("../MongoDBDatabaseConfig/models/Users")
const {TokenGenerator,verifyToken} = require("../DevHelp/Token")
const { IdGenerator } = require("../DevHelp/ID");
require("dotenv").config()
const ProjectId = process.env.Project_Id
// console.log(process.env.JWT_ACCESS_TOKEN_SECRET)

class Authentication{

    async SignUp(req,res){
        try{
            const {Name,Email,password,PhoneNo,Type} = req.body //Type we dont get from the user.
            const ValidatonError = validationResult(req)
            let saveduser
            // check with email and phone number weather or not user already exsits 
            if(!ValidatonError.isEmpty()){
                return unsuccessfulResponse(req,res,422,"Validation Error",ValidatonError,ProjectId)
            }

            const Password = await bcrypt.hash(password, 10);


            const UserObject = {
                    Id:"U-"+IdGenerator(),
                    Name:Name,
                    Email:Email,
                    PhoneNo:PhoneNo,
                    Type:Type,
                    Password:Password
            } 

            
            

            const newUser = new User(UserObject)
            try{
                saveduser = await newUser.save();
            }
            catch(error){
                return unsuccessfulResponse(req,res,501,"Some Problem with saving data onto the database",error,ProjectId)
                
            }
            
            
            const newToken = TokenGenerator({Id:saveduser.Id,userType:Type})
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
                return unsuccessfulResponse(req,res,501,"internal serve Error",error,ProjectId)
            }
            const user = await User.findOne({Email:Email})
            if (!user){
                return unsuccessfulResponse(req,res,404,"User not found","User not found",ProjectId) //devide the unsuccessful errors into different types that they are 
            }
            
            const match = await bcrypt.compare(Password, user.Password);
            if (match){
                const token = TokenGenerator({Id:user.Id,userType:user.Type})
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

    async UserInfo(req,res){
        try{
            const userId = req.userId
            const foundUser = await User.findOne({Id:userId})
            if(foundUser){
                const Info = {
                    Id:foundUser.Id,
                    Name:foundUser.Name,
                    PhoneNo:foundUser.PhoneNo,
                    Email:foundUser.Email,
                    Type:foundUser.Type,
                    PgAssociation:foundUser.PgAssociation

                }
                return successfulResponse(res,"user data",Info)
            }
            return unsuccessfulResponse(req,res,404,"No user data Found","no user data",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"internal server error",error,ProjectId)
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

    async tenentInfo(req,res){
        try{
            const {UserId} = req.body
            const userInfo = await User.findOne({Id:UserId})
            const OwnerInfo = await User.findOne({Id:req.userId})
            if(userInfo.PgAssociation === OwnerInfo.PgAssociation){
                return successfulResponse(res,"Here is the userInformation",userInfo)
            }
            return unsuccessfulResponse(req,res,404,"User not tenent","mismatch of pg association",ProjectId)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server error",error,ProjectId)
        }
    }

    async CreateEmployeeAccount(req,res){
        try{
            const {Name,Email,PhoneNo,password} = req.body
            const Password = await bcrypt.hash(password, 10)
            const PgOwnerInfo = await User.findOne({Id:req.userId})
            const UserObject = {
                Id:"U-"+IdGenerator(),
                Name:Name,
                Email:Email,
                PhoneNo:PhoneNo,
                Type:"PgEmployee",
                Password:Password,
                PgAssociation:PgOwnerInfo.PgAssociation
            } 
        
        

        const newUser = new User(UserObject)
        newUser.save()
        return successfulResponse(res,"Employee Created Successfully save the password you wont see it again",{Email:Email,Password:password})

        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal Server Error CreateEmployeeAccount",error,ProjectId)
        }
    }

    async ShowAllEmployeesInaPg(req,res){
        try{
            const UserInfo = await User.findOne({Id:req.userId})
            const Employees = await User.find({Type:"PgEmployee",PgAssociation:UserInfo.PgAssociation})
            return successfulResponse(res,"Here are all the employees in the Pg",Employees)
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"Internal server ErrorShowAllEMployeesInaPg",error,ProjectId)
        }
    }
    async UserInfoFromUserId(req,res){
        try{
            const {UserId} = req.query
            const UserInfo = await User.findOne({Id:UserId})   
            if(!UserInfo){
                return unsuccessfulResponse(req,res,404,"No User with such Id","In-correct UserId",ProjectId)
            }
            return successfulResponse(res,"UserName",{UserName:UserInfo.Name})
        }
        catch(error){
            return unsuccessfulResponse(req,res,501,"internal server error UserInfoFromUserId",error,ProjectId)
        }
    }

}

module.exports = new Authentication