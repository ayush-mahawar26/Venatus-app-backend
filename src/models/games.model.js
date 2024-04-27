
import mongoose, { Schema } from "mongoose";

const gameSchema = Schema({
    gameName : {
        type : String ,
        required : true ,
        trim : true,
    },
    imgUrl : {
        type : String ,
        required : true ,
        trim: true
    }
})

export const gameModel = mongoose.model("Game" , gameSchema) ;