
import mongoose, { Schema } from "mongoose";

const postSchema = Schema({
    postBy : {
        type: Schema.Types.ObjectId ,
        ref : "User",
        required : true 
    },

    caption : {
        type : String ,
        required : true ,
        trim : true
    },

    postImage : {
        type : String ,
        required : true ,
        trim : true 
    }
})

export const postModel = mongoose.model("Post" , postSchema) ;