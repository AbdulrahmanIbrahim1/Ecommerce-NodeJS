const jwt = require('jsonwebtoken');    
const ApiError = require('../utils/apiError');

module.exports= function(req,res,next){
    const token = req.header('Authorization')
    ?.replace('Bearer ', '');

    if(!token){
        // return res.status(401).json({message:"Access Denied. No token provided"})   
        return next(new ApiError('Access Denied. No token provided'))
    }
    // try{
        // console.log('token is' ,token)
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY ,options={algorithms:["HS256"]});
        req.user = decode;
        next();
    // }
    // catch{
    //     res.status(401).json({message:"Invalid Token"})
    // }
}