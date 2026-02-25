const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) =>{
    const authHeader = req.header('Authorization'); // extracting the token from header

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({error: "Access denied to token found"})
    }

    const token = authHeader.split(' ')[1];

    try{
        const verified = jwt.verify(token,process.env.JWT_SECRET); // verifying from the jwt_key

        req.user = verified;
        next();
    }
    catch(error){
        res.status(403).json({error:"Invalid/Expired token"})
    }
};

module.exports = verifyToken;