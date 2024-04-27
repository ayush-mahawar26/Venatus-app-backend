
import {mongoose} from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDb = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGOURL) ;
        console.log("Connected to database !!");
    } catch (error) {
        throw new ApiError(500 , "server Issue") ;
    }
}

export default connectDb ;