const Express = require("express")
const router = Express.Router()
const middleware = require("../Middlewares/Authentication")
const controller = require("../Controllers/Services")
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
controller.ShowAllServices
)

module.exports = router