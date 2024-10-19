import {asyncHandler} from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utills/cloudinary.js";
import { ApiResponse } from "../utills/ApiResponse.js";

const generateAccessTokenandRefreshToken = async (userId)=>{
    const user =  await User.findById(userId);
    const accessToken =  user.generateAccessToken();
    const refreshToken =  user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforesave:false});
    return {accessToken, refreshToken}

}


const reginsterUser = asyncHandler(async (req, res)=>{
    //get the data from frontend
    //validate the fields
    //check if username or email already exists
    //upload the avtar to cloudinary, check if uplaod or not
    //create an object for users data 
    //save the userdata to databse
    //return the response
    //remove password and refresh token from the response

    const {username, email, fullname, password} = req.body;
    
    if(
        [username, email, fullname, password].some((field)=> 
            field?.trim() === "")

    ){
        throw new ApiError(400, "All fields are reuired");
    }

    const existingUsername =  await User.findOne({
        $or: [{username},{email}]
    })

    if(existingUsername){
        throw new ApiError(409, "Username or Email already exists.")
    }

    const avatarLocalPath = req.files?.avtar[0]?.path;
    const coverImageLocalPath = req.files?.coverimage[0]?.path

   const avtar =  await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
   if(!avtar){
        throw new ApiError(400, "Avatar not uploaded")
   }

  const user = await User.create({
    username: username?.toLowerCase(),
    email,
    password,
    fullname,
    avtar: avtar.url,
    converiamge: coverImage?.url || "",
   })

   const createdUser = await User.findById(user._id).select("-password, -refreshToken")
   if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user");
   }

   return res.status(201).json(
     new ApiResponse (200, createdUser, "User Registered Successfully")
    )


})

const loginUser = asyncHandler(async (req, res, next)=>{
    //get data from body
    //validate fileds
    //login based on email or username
    //check user exist
    // match password
    // access and refresh token

    const {email, username, password} = req.body;

    if(!(email || username)){
        throw new ApiError(400, "Email or Username is required");
    }

    if(!password){
        throw new ApiError (400, "Password is required");
    }

    const user =  await User.findOne({
        $or: [{email}, {username}]
    })

    if(!user){
        throw new ApiError(401, "User does not exists")
    }

   const validPassword =  await user.isPasswordCorrect(password)
   if(!validPassword){
        throw new ApiError(401, "Invalid user credentials")
   }

   const {accessToken, refreshToken} =  await generateAccessTokenandRefreshToken(user._id)

   const loggedinUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
        httpOnly: true,
        secure: true
   }

   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
     new ApiResponse(200, 
            {user: loggedinUser, refreshToken, accessToken},
            "User Logged in successfully"
        )
   )

})


const logOutUser = async (req, res, next)=>{
    const userId = req.user?._id;
   await User.findByIdAndUpdate(userId,
        {
        $set: {refreshToken: "undefined"}
        },
        {
            new : true
        }
    )
    
    const options = {
        httpOnly: true,
        secure: true
   }

    return res.status(200)
    .clearCooke("refreshToken",options)
    .clearCooke("accessTokeen",options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )

}


export {reginsterUser, loginUser, logOutUser}