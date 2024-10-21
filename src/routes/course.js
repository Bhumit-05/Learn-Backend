const express = require("express");
const { CourseModel, PurchaseModel } = require("../db");
const { userMiddleware } = require("../middlewares/user");
const Router = express.Router;

const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res){

    const userId = req.userId;
    const courseId =req.body.courseId;

    await PurchaseModel.create({
        userId : userId,
        courseId : courseId
    })

    // logic for payment to be written over here

    res.json({
        message : "Course successfully purchased!"
    })
})

module.exports = courseRouter;