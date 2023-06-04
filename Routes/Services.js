const Express = require("express")
const router = Express.Router()
const middleware = require("../Middlewares/Authentication")
const controller = require("../Controllers/Services")
const serviceMiddleware = require("../Middlewares/Services")
const {body,query} = require("express-validator")

router.post("/CreateService",
middleware.verfiyLogin,
middleware.verfiyPgOwner,
[
    body("ServiceName").notEmpty().withMessage("ServiceName is required"),
    body("TimeBased").notEmpty().withMessage("TimeBased is required")
],
controller.CreateService)

router.get("/AllServices",
middleware.verfiyLogin,
controller.ShowAllServices)

router.get("/ServiceDetail",
[
    query("SerivceId").notEmpty().withMessage("ServiceId is required in query")
],
controller.ServiceDetail)

router.get("/AllSerivcesByPgId",
[
    query("PgId").notEmpty().withMessage("PgId is required in query")
],
controller.ShowAllServicesByPgId)

router.post("/CreateServiceRequest",
middleware.verfiyLogin,
middleware.VerifyCustomer,
[
    body("ServiceId").notEmpty().withMessage('ServiceId is required')
],
controller.CreateServiceRequest)

router.post("/ChangeStatus",
middleware.verfiyLogin,
[
    body("status").notEmpty().withMessage("status is required"),
    body("ServiceId").notEmpty().withMessage('ServiceId is required')
],
serviceMiddleware.verfiyServiceStatus,
 controller.ChangeSRStatus)

router.get("/ShowAllSR",
[
    query("OnlyActive").isBoolean().notEmpty().withMessage("OnlyActive is required in query")
],
middleware.inputValidation,
middleware.verfiyLogin,
controller.ShowAllSR)

router.get("/SRDetail",
[
    query("ServiceRequestId").notEmpty().withMessage("ServiceRequestId is required in Query parameter")
],
middleware.inputValidation,
middleware.verfiyLogin,
controller.ServiceRequestDetail)

router.post("/assignTask",[
    body("ServiceRequestId").notEmpty().withMessage("ServiceRequestId is required"),
    body("EmployeeId").notEmpty().withMessage("EmployeeId is required")
],
middleware.inputValidation,
middleware.verfiyLogin,
middleware.verfiyPgOwner,
controller.AssignTask)
module.exports = router