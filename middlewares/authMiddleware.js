const JWT = require('jsonwebtoken')
const dotenv = require("dotenv")

dotenv.config()

module.exports = async (req,res,next)=>{
    try{
    const token = req.headers['authorization'].split(" ")[1]
    JWT.verify(token,process.env.JWT_SECRET,(err,decode)=>{
        if(err){
            return res.status(200).send({message:"Autho failed",success:false})
    }
    else{
        req.body.userId = decode.id
        next()
    }
})
}
catch(error){
    console.log(error)
    res.status(401).send({success:false,message:"Authorization failed"})
}
}