const jwt = require('jsonwebtoken');


exports.verifyToken = (req,res,next)=>{
    const secretKey = process.env.APP_SECRET;
    
    
    
}