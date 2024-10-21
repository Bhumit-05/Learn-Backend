const express = require("express");
const Router = express.Router;
const { z } = require("zod");
const { UserModel } = require("../db");
const { JWT_USER_SECRET } = require("../constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middlewares/user");

const userRouter = Router();


userRouter.post("/signup", async function(req, res){

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

            await UserModel.create({
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
                message : "User already exists!"
            })
        }
    }
})


userRouter.post("/signin", async function(req, res){

    const requiredBody = z.object({
        email : z.string().email(),
        password : z.string().min(5),
        name : z.string().min(3)
    })

    const { success, error } = requiredBody.safeParse(req.body);

    if(success){
        const { email, password } = req.body;
    
        const user = await UserModel.findOne({
            email : email
        })

        if(!user){
            res.json({
                message : "No user found, Please sign up first!"
            })
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){
            const token = jwt.sign({
                id : user._id.toString()
            }, JWT_USER_SECRET);

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


userRouter.get("/myCourses", userMiddleware,function(req, res){
    res.json({
        message : "buy courses endpoint"
    })
})


module.exports = userRouter;