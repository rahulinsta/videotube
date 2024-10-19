import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import  jwt  from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJWT = asyncHandler(async(req, res, next)=>{
   try{

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    if(!token){
        throw new ApiError(401, "Unauthrized request")
    }

    const decodedUser = jwt.verify(accessToken, evn.proccess.ACCESS_TOKEN_SECRET)

    const user = User.findById(decodedUser?._id).select("-password", "refreshToken")

    if(!user){
        throw new ApiError(401, "Invalid accessToken")
    }

    req.user = user;
    next()

   }catch(err){
        throw new ApiError(401,  err?.message || "Invalid accessToken")
   }



})