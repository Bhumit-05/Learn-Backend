const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../constants");

function adminMiddleware(req, res, next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_ADMIN_SECRET);

    if(decodedData){
        req.adminId = decodedData.id;
        next();
    }
    else{
        res.status(403).json({
            message : "You are not signed in."
        })
    }
}

module.exports = {
    adminMiddleware
}