const Express = require("express")
const router = Express.Router()
const middleware = require("../Middlewares/Authentication")
const controller = require("../Controllers/Notice")
const {body,query} = require("express-validator")

router.post("/CreateNotice",middleware.verfiyLogin,middleware.verfiyPgOwner,
[
    body("Msg").notEmpty().withMessage("Msg is required")
],
controller.CreateNotice)

router.get("/GetNotices",[
    query("OnlyActive").notEmpty().withMessage("OnlyActive is required in query")
],
middleware.inputValidation,
middleware.verfiyLogin,
controller.GetNotice)

router.post("/DeactivateNotice",
[
    body("NoticeId").notEmpty().withMessage("NoticeId is required in body")
]
,middleware.inputValidation,
middleware.verfiyLogin,
middleware.verfiyPgOwner,
controller.DeactivateNotice
)

module.exports = router