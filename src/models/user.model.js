
import mongoose, { Mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = Schema({
    fullName : {
        type : String ,
        trim : true ,
    },
    email : {
        type : String ,
        required : true ,
        trim : true ,
        lowercase : true 
    },
    ign : {
        type : String ,
        trim : true ,
        lowercase : true 
    },
    password :{
        type : String ,
        required : true ,
        trim : true ,
    },
    avtar :{
        type : String ,
    },
    phoneNumber : {
        type : String ,
        trim : true ,
    },
    posts : [{
        type : Schema.Types.ObjectId ,
        ref : "Post"
    }],
    games : [
        {
            type : Schema.Types.ObjectId,
            ref : "Game"
        }
    ],
    isAdmin : {
        type : Boolean,
        require : true ,
        default : false,
    },

    refreshToken : {
        type : String,
        trim : true
    },

    profileCompleted : {
        type : Boolean ,
        required : true ,
        default : false
    },

    isVerified : {
        type : Boolean ,
        required : true ,
        default : false ,
    }

})

userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) return next() ;

    this.password = await bcrypt.hash(this.password, 10) ;
    next() 

})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            id : this._id ,
            email : this.email ,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {
            id : this._id ,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const userModel = mongoose.model("User" , userSchema) ;