import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';
import axios from 'axios';

export const AuthContext = createContext({});

const client = axios.create({
    baseURL : "http://localhost:8000/api/v1/users/"
})

export const AuthProvider = ({children}) =>{

    const authContext =  useContext(AuthContext);

    const [userData, setUserData] = useState(authContext);

    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try{
  
            let request = await client.post("/register",{
                name : name,
                username: username,
                password: password
            })

            if(request.status === httpStatus.CREATED){
                return request.data.message;
            }
        } catch(err){
             throw err;
        }
    }

    const handleLogin = async(username, possword) => {
        try{
             let request = await client.post("/login",{
                username: username,
                password: password
             })

             if(request.status === httpStatus.OK){
                localStorage.setItem("token",request.data.token);
             }

        }catch(err){
           throw err;
        }
    }

    const data = {
        userData, setUserData, handleRegister
    }

    return (
      <AuthContext.Provider value={data}>
        {children}
      </AuthContext.Provider>
    )
}