const express = require("express");
const Router = express.Router;
const { AdminModel, CourseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require("../constants");
const { adminMiddleware } = require("../middlewares/admin");

const adminRouter = Router();


adminRouter.post("/signup", async function(req, res){

    const requiredBody = z.object({
        email : z.string().email(),
        password : z.string().min(5),
        name : z.string().min(3)
    })

    const { success, error } = requiredBody.safeParse(req.body);

    if(!success){
        error.errors.map(e => {
            console.log(e.message);
        })

        res.json({
            message : "Invalid format!"
        })
    }
    else{
        const { email, password, name } = req.body;
        
        try{
            const hashedPassword = await bcrypt.hash(password, 5)

            await AdminModel.create({
                email : email,
                password : hashedPassword,
                name : name
            })

            res.json({
                message : "Signup Successful!"
            })
        }
        catch(e){
            res.json({
                message : "Admin already exists!"
            })
        }
    }
})


adminRouter.post("/signin", async function(req, res){

    const requiredBody = z.object({
        email : z.string().email(),
        password : z.string().min(5),
        name : z.string().min(3)
    })

    const { success, error } = requiredBody.safeParse(req.body);

    if(success){
        const { email, password } = req.body;
    
        const admin = await AdminModel.findOne({
            email : email
        })

        if(!admin){
            res.json({
                message : "No admin found, Please sign up first!"
            })
            return;
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if(passwordMatch){
            const token = jwt.sign({
                id : admin._id.toString()
            }, JWT_ADMIN_SECRET);

            res.json({
                token : token
            })
        }
        else{
            res.status(403).json({
                message : "Incorrect Password!"
            })
        }
    }
    
    else{
        error.errors.map(e => {
            console.log(e.message);
        })

        res.json({
            message : "Invalid format!"
        })
    }
})


adminRouter.post("/course", adminMiddleware, async function(req, res){
    const { title, description, price, imageURL } = req.body;
    const adminId = req.adminId;

    const course = await CourseModel.create({
        title : title,
        description : description,
        price : price,
        imageURL : imageURL,
        creatorId : adminId
    })

    res.json({
        message : "Course created!",
        courseId : course._id
    })
})


adminRouter.put("/course", adminMiddleware, async function(req, res){
    const adminId = req.adminId;
    const { title, description, price, imageURL, courseId } = req.body;
    
    await CourseModel.updateOne({
        _id : courseId,
        creatorId : adminId
    },
    {
        title : title,
        description : description,
        price : price,
        imageURL : imageURL
    })

    res.json({
        message : "Course upadated",
        CourseId : courseId
    })
})


adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminId = req.adminId;

    const courses = await CourseModel.find({
        creatorId : adminId
    });

    res.json({
        adminId : adminId,
        courses
    })
})


module.exports = adminRouter;