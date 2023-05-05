const Express = require("express")
const router = Express.Router()
const middleware = require("../Middlewares/Authentication")
const controller = require("../Controllers/Notice")
const {body} = require("express-validator")

router.post("/CreateNotice",middleware.verfiyLogin,middleware.verfiyPgOwner,
[
    body("Msg").notEmpty().withMessage("Msg is required")
],
controller.CreateNotice)

module.exports = router