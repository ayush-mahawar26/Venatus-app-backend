import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import http from "http" ;
import { Server } from "socket.io";

const app = express() ;
const httpServer = http.createServer(app) ;
const io = new Server(httpServer , {})

app.use(cors()) ;

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

// routes 
import { userRoutes } from "./routes/user.routes.js";
app.use("/users" , userRoutes) ;




export{ httpServer , io};