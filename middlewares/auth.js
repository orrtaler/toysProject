const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");

exports.auth = (req,res,next) => {
  let token = req.header("x-api-key")
  if(!token){
    return res.status(401).json({msg:"You need to send token to this endpoint url"})
  }
  try{
    let decodeToken = jwt.verify(token, config.tokenSecret);
    req.tokenData = decodeToken;
    next();
  }
  catch(err){
    console.log(err);
   return res.status(401).json({msg:"Token not valid or expired log in again or you are a hacker!"})
  }
}

exports.authAdmin = (req, res, next) => {
  let token = req.header("x-api-key")
  if(!token){
    return res.status(401).json({msg:"You need to send token to this endpoint url"})
  }
  try{
    let decodeToken = jwt.verify(token, config.tokenSecret);
    if(decodeToken.role != "admin"){
      return res.status(401).json({msg:"token invalid or expire, code:3"})
    }
    req.tokenData = decodeToken;
    next();
  }
  catch(err){
    console.log(err);
   return res.status(401).json({msg:"Token not valid or expired log in again or you are a hacker!"})
  }
}