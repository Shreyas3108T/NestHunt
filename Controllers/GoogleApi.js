const axios = require("axios");
const { unsuccessfulResponse, successfulResponse } = require("../DevHelp/Response");
class GoogleApi{

    // GoogleEndPoint = "https://maps.googleapis.com/maps/api"
    // GoogleAPIKey = process.env.GoogleAPIKey

    async AutoComplete(req,res){
        try{
            const GoogleEndPoint = "https://maps.googleapis.com/maps/api"
            const GoogleAPIKey = process.env.GoogleAPIKey
            const {query} = req.query;
            const url = `${GoogleEndPoint}/place/autocomplete/json?input=India%20${query}&types=geocode&language=fr&key=${GoogleAPIKey}`;
            const response = await axios.get(url);
            
            return successfulResponse(res,"auto-complete-data",response.data.predictions);
        }
        catch(error){
            console.log(error);
            return unsuccessfulResponse(req,res,501,"internal server error UserInfoFromUserId",error,1)
        }

    }

    async locationSearchApi(req,res){
        try{
            const GoogleEndPoint = "https://maps.googleapis.com/maps/api"
            const GoogleAPIKey = process.env.GoogleAPIKey
            const {query} = req.query;
            const placeData = await axios.get(`${GoogleEndPoint}/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=${GoogleAPIKey}`)
            return successfulResponse(res,"location-data",placeData.data.candidates[0].geometry.location)
        }
        catch(error){
            console.log(error);
            return unsuccessfulResponse(req,res,501,"internal server error UserInfoFromUserId",error,1)
        }
    }
}

module.exports = new GoogleApi