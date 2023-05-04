const Express = require("express")
const router = Express.Router()
const middleware = require("../Middlewares/Authentication")
const controller = require("../Controllers/Booking")
const {body} = require("express-validator")

router.post("/viewRequest",[
    body("RoomId").notEmpty().withMessage("RoomId is required"),
    body("PgId").notEmpty().withMessage("PgId is required"),
    body("date").notEmpty().withMessage("date is required in the format dd/mm/yyyy")
],middleware.verfiyLogin,middleware.VerifyCustomer,controller.ViewRequest)


module.exports = router