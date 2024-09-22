import { Server, Socket } from "socket.io";

let connection  = {};//how many connect 
let message = {}; // message
let timeOnline = {}; //time
export const connectToServer = (server)=>{
    const io = new Server(server,{
        cors:{                //this is use for testing not in production level
            origin: "*",
            methods: ["GET","POST"],
            allowedHeaders: ["*"],
            credentials: true

        }
    })
    io.on("connection",(socket)=>{//connect socket
       
     console.log("SOMETHINF CONNECTED");

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

            const [matchingRoom, found] = Object.entries(connection) //find people
            .reduce(([room, isFound], [roomKey, roomValue]) => {
                if(!isFound && roomValue.includes(socket.id)){
                   return [roomKey, true];
                }

                return [room, isFound];
            }, [' ', false]);

        if(found === true){
            if(message[matchingRoom] === undefined){//check message is null or not
                message[matchingRoom] = [];
            }

            message[matchingRoom].push({'sender':sender, 'data':data, 'socket-id-sender':socket.id})
            console.log("message", key, ":",sender," ",data);

             //send data
             connection[matchingRoom].forEach((ele) => {
                io.to(ele).emit('chat-message', data, sender, socket.id)
             })
        }

        })

        socket.on("disconnection",()=>{
            
            var difference = Math.abs(timeOnline[socket.id] - new Date())

            var key;

            for(const [k, v] of JSON.parse(JSON.stringify(Object.entries(connection)))){

                for(let a=0; a<v.length; a++){
                    key = k;

                    for(let a=0; a<connection[key].length; ++a){
                        io.to(connection[key][a]).emit('user-left', socket.id)
                    }

                    var index = connection[key].indexOf(socket.id)

                    connection[key].splice(index, 1);
                       
                    if(connection[key].length === 0){
                        delete connection[key];
                    }

                }
            }

        })
    });
    return io;
}
