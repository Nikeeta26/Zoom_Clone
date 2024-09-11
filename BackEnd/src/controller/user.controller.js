import { User } from "../model/UserSchema.js";
import httpStatus from "http-status";
import bcrypt ,{hash} from "bcrypt";
import crypto from "crypto";

const login = async(req,res)=>{
   const{username,password} = req.body;
     if(!username ||!password){
        return res.status(400).json({messege:"Please provide"});
     }
    // try{
        const user  = await  User.findOne({username});
        if(!user){
         return res.status(httpStatus.NOT_FOUND).json({messege:"user not fount"});
        }
        if(bcrypt.compare(password, user.password)){

            let token = crypto.randomBytes(20).toString("hex");    //store token
            
            user.token = token;

            await user.save();

            return res.status(httpStatus.OK).json({token:token});
        }
    // } catch(err){
    //     return res.status(500).json({messege:`something went wrong ${err}`});
    // }
}


const register = async(req,res)=>{
    const{name, username, password} = req.body;

    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({messege:"User already exist"});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name:name,
            username:username,
            password:hashedPassword

        });
        await newUser.save();
        res.status(httpStatus.CREATED).json({messege:"user register"});
    }catch(err){
        res.json({messege:`something went wrong ${err}`});
       console.log("erro occurese",err);
    }
}
export {login, register};