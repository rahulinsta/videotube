import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";

const connectDb =  async ()=>{
    try{

       const mongoDbConnectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}}`);
       console.log(`Databse connected on host:`, mongoDbConnectionInstance.connection.host);
       
    }catch(error){
        console.error("MONGODB CONNECTION ERROR:", error);
        process.exit(1);
    }
}

export default connectDb;