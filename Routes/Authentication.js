const Express = require("express")
const router = Express.Router()
const middleware = require("../Middlewares/Authentication")
const controller = require("../Controllers/Authentication")
const {body} = require("express-validator")


router.post('/Signup',[
    body('Name').notEmpty().withMessage("Name is required"),
    body('Email').notEmpty().withMessage("Email is required "),
    body('password').isLength({min:8}).withMessage("password must be atleast 8 characters"),
    body('PhoneNo').notEmpty().withMessage("Phone Number"),
    body('Type').notEmpty().withMessage("Type of user is required")
],controller.SignUp)


router.post('/Signin',[
    body('Email').isEmail().withMessage("please enter a valid email address"),
    body('Password').isLength({min:8}).withMessage("password must be atleast 8 characters")
],
controller.SignIn)

router.get("/UserInfo",middleware.verfiyLogin,controller.UserInfo)
router.get("/Authtest",middleware.verfiyLogin,controller.Authtest)

module.exports = router