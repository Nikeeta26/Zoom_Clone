import {Schema} from "mongoose";
import mongoose from 'mongoose';

const UserSchema = new Schema (
    {
       name :{type:String, required:true},
       username:{type:String, required:true, unique:true},
       password:{type:String, required:true},
       token:{type:String}//store only token and all this tak using feach;

    }
)
const User = mongoose.model("User",UserSchema);
export  {User};