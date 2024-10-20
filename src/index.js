const express = require("express");
const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");
const adminRouter = require("./routes/admin");
const mongoose = require("mongoose");


const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main(){
  mongoose.connect("mongodb+srv://Bhumit_05:FKTq5Z4sBA2sT0SE@cluster0.tnup1.mongodb.net/course-selling-app");
  app.listen(3000);
}

main();
