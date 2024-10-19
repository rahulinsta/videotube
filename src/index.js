import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import express  from "express";
import dotenv from "dotenv";
import connectDb from "./db/databse.js";
import {app} from "./app.js"

//const app = express();

/* dotenv.config({
    path: './env'
});

(async ()=>{
    console.log(process.env.MONGODB_URI);
    try{

        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) =>{
            console.error("Error while connection", error);
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    }catch(error){

        console.error("Error:", error);
    }
})() */

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`App is running on PORT ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`MongoDB connection Error ${err}`)
})