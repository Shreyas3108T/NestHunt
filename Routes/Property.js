const Express = require("express")
const router = Express.Router()
const middleware = require("../Middlewares/Authentication")
const controller = require("../Controllers/Property")
const {body} = require("express-validator")


router.post("/CreateProperty",
middleware.verfiyLogin, //check if login or not 
middleware.verfiyPgOwner, //check if the user is of the right type to be able to access the API
[body('Name').notEmpty().withMessage("Name is required"),
body('longitude').notEmpty().withMessage("longitude is required").isNumeric("Invalid Latitude"),
body('latitude').notEmpty().withMessage("latitude is required").isNumeric("invalid Latitude"),
body('street').notEmpty().withMessage("street is required"),
body('city').notEmpty().withMessage("city is required"),
body('state').notEmpty().withMessage("state is required"),
body('zip').notEmpty().withMessage("zip is required").isNumeric().withMessage("Invalid zip")], //validation 
controller.CreateProperty //finally if everything works then come to controller 
)

router.get("/PropertyDetail",
controller.GetProperty)

router.get("/search",controller.Search)

module.exports = router
