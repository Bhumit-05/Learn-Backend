require('dotenv').config()
const express = require("express");
const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");
const adminRouter = require("./routes/admin");
const mongoose = require("mongoose");
const { CourseModel } = require('./db');


const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

app.get("/preview", async function(req, res){
  const courses = await CourseModel.find({});

  res.json({
    courses
  });
})

async function main(){
  mongoose.connect(process.env.MONGO_URL);
  app.listen(3000);
}

main();
