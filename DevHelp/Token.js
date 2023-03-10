const jwt = require('jsonwebtoken');
require("dotenv").config()

exports.TokenGenerator = (payload)=>{
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign(payload, accessTokenSecret, {
        expiresIn: '1d',
    });
    return accessToken;
}

exports.verifyToken = (token) =>{
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    return jwt.verify(token, accessTokenSecret);
}