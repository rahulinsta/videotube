import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username:{
            type : String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            index: true
        },

        email:{
            type : String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },

        fullname:{
            type : String,
            required: true,
            trim: true,
            index: true
        },

        avtar:{
            type : String,
            required: true,
            trim: true,
        },

        coverimage:{
            type : String,
            trim: true,
        },

        password:{
            type : String,
            required: [true, "Password is required"],
            trim: true,
        },
        refreshToken:{
            type : String,
        },

        watchhistory:[{
            type : Schema.Types.ObjectId,
            ref: "Video"
        }
            
        ]

    }
, {timestamps: true})

userSchema.pre("save", async function(next){
    if(this.isModified()){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    jwt.sign({
        _id : this._id,
        email : this.email,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

    )
}


userSchema.methods.generateRefreshToken = function (){
    jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }

    )
}




export const User = mongoose.model("User", userSchema);