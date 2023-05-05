const Express = require("express")
const router = Express.Router()
const middleware = require("../Middlewares/Authentication")
const controller = require("../Controllers/Booking")
const {body,query} = require("express-validator")

router.post("/viewRequest",[
    body("RoomId").notEmpty().withMessage("RoomId is required"),
    body("PgId").notEmpty().withMessage("PgId is required"),
    body("date").notEmpty().withMessage("date is required in the format dd/mm/yyyy")
],middleware.verfiyLogin,middleware.VerifyCustomer,controller.ViewRequest)

router.post("/ApproveRequest",[
    body("BookingId").notEmpty().withMessage("BookingId is required"),
    body("approvalStatus").notEmpty().withMessage("approvalStatus is reuqired").isNumeric()
],
middleware.verfiyLogin,middleware.verfiyPgOwner,controller.ApproveRequest
)

router.get("/Allbooking",middleware.verfiyLogin,middleware.verfiyPgOwner,controller.AllBooking)

router.get("/BookingInfo",
[query("BookingId").notEmpty().withMessage("BookingId is required in Query parameter")],
middleware.verfiyLogin,controller.BookingInfo)


router.get("/Tenents",middleware.verfiyLogin,middleware.verfiyPgOwner,controller.AllTenents)
module.exports = router