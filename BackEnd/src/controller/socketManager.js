import { Server, Socket } from "socket.io";

let connection  = {};//how many connect 
let message = {}; // message
let timeOnline = {}; //time
export const connectToServer = (server)=>{
    const io = new Server(server);
    io.on("connection",(socket)=>{//connect socket
       

         socket.on("join-call",(path)=>{  //join
          
            if(connection[path]== undefined){
                connection[path] = [];
            }
            connection[path].push(socket.id)
            
            timeOnline[socket.id] = new Date();
            
        //    connection[path].forEach(element => {
        //        io.to(element);
        //    });   

        /**** or  ****/

            for(let a=0; a<connection[path].length;i++){
                io.to(connection[path][a]).emit("user-joined",socket.id,connection[path]);
            }
            if(message[path] !== undefined){
                for(let a; a<message[path].length;+a){
                    io.to(socket.id).emit("chat-message",message[path][a]['data'],
                        message[path][a]['sender'],message[path][a]['socket-id-sender'])
                }
            }
         })


         socket.on("signal",(toId,message)=>{
            io.to(toId).emit("signal",socket.id,message);

         })


        socket.on("chat-message",(data,sender) => {
 

        })

        socket.on("disconnection",()=>{


        })
    });
    return io;
}
