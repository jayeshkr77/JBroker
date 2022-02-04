const logger = require('../utilites/logger');
const jwt = require('jsonwebtoken');


function authentication(req,res,next){
    if(req.headers.authorization){
        console.log(req.headers.authorization);
        let decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
        console.log(decoded);
    }
    
    next();
}
module.exports = authentication;