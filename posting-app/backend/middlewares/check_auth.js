const jwt = require('jsonwebtoken');
module.exports = (req, res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret_should_last_longer");
        req.userData = {email: decodedToken.email, userid: decodedToken.userid}
        next();
    }catch(error){
        res.json({success: false, msg: 'Auth failed!'})
    }
}
