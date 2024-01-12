const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/user_management");

const app = express();



// for user routes

const userRoute = require("./routes/userRoute");
app.use('/', userRoute);


// for Admin routes

const adminRoute = require("./routes/adminRoute");
app.use('/admin', adminRoute);




app.listen("3000", ()=>{
    console.log("server is running on port 3000.");
});