const express = require("express");
const Router = express.Router;

const courseRouter = Router();

courseRouter.post("/purchase", function(req, res){
    res.json({
        message : "course purchase endpoint"
    })
})

courseRouter.get("/preview", function(req, res){
    res.json({
        message : "course preview endpoint"
    })
})

module.exports = courseRouter;