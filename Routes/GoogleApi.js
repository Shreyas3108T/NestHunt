const Express = require("express")
const router = Express.Router()
const controller = require("../Controllers/GoogleApi")
const {body} = require("express-validator")


router.get('/auto-complete',controller.AutoComplete);

router.get("/location",controller.locationSearchApi);

module.exports = router;