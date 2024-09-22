import express from "express";

import {createServer} from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";

import cors from "cors";

import userRoutes from "./routes/users.routes.js";

import {expressError} from "./util/expressError.js"

import httpStatus from "http-status";

import { connectToServer } from "./controller/socketManager.js";

const app = express();
const server = createServer(app);
const io = connectToServer(server);
// const io = new Server(server);
// app.use(userRoutes)
app.set("port",(process.env.PORT || 8000));
app.use(cors("http://localhost:5173/"));
app.use(express.json({"limit":"40kb"}));
app.use(express.urlencoded({"limit":"40kb",extended:true}));

app.get("/",(req,res)=>{
    return res.json({"hello":"world"});
});

app.use("/api/v1/users",userRoutes);


app.use((err, req, res, next) => {
    let { statusCode=500, message="something went wrong" } = err;
    // res.status(statusCode).render("error.ejs",{message});
    return res.status(500).json({statusCode:statusCode,message:message});
  });

const start = async() =>{
    const connectionDb =await mongoose.connect("mongodb+srv://nikeetakaudare14:dbnikeeta@cluster0.3bh7f.mongodb.net/");//("mongodb+srv://nikeetakaudare14:nikeeta@26@cluster0.rjwrq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
   console.log(`Host connetion ${connectionDb.connection.host}`);
   server.listen(app.get("port"),()=>{
        console.log("Listsing on port 8000");
    });
}

start();