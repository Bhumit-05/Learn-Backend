const express = require("express");
const Router = express.Router;
const { AdminModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require("../constants");

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

module.exports = adminRouter;