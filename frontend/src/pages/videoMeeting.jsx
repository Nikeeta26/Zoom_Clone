import React, { useEffect, useRef } from "react";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { io } from "socket.io-client";


import "../style/videoMeeting.css";

const server_url = "http://localhost:8000";

var connection = {};    //connect people

const peerConfigConnection = {
    "iceSwrver" : [
        {"urls" : "stun:stun.l.google.com:19302"} //stun servers
    ]
}
export default function VideoMeeting() {

    var socketRef = useRef(); // which socket
    let socketIdRef = useRef();  //socket id, own socket id

    let localVideoRef = useRef(); //your own video will see here

    let [videoAvailable, setvideoAvailable] = useState(true); // video permision wise available or not

    let [audioAvailable, setaudioAvailable] = useState(true);

    let [video, setVedio] = useState();    //start vedio and stop

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();//share screen

    let [showModel, setModel] = useState(); //use for pop of

    let [screenavailable, setscreenavailable] = useState();// check screem is availbale or not

    let [messages, setMessages] = useState(); // handle messages

    let [message, setMessage] = useState(""); //write message

    let [newMessage, setnewMessage] = useState(0);//for new message

    let[askForUsername, setaskForUsername] = useState(true);//when login from guest

    let[username, setUsername] = useState(0);//for user

    const videoRef = useRef([]);

    let[videos,setVedios] = useState([]);


    const getPermission = async () =>  {
        try{
            /* The MediaDevices interface of the Media
              Capture and Streams API provides access to connected
               media input devices like cameras and microphones,
               as well as screen sharing. In essence, it lets you obtain
                access to any hardware source of media data.*/
        const videoPermissio = await navigator.mediaDevices.getUserMedia({video:true});
 
        //video
          if(videoPermissio) {
            setvideoAvailable(true);
          }
          else{
            setvideoAvailable(false);
          }

          //audio
          const audioPermissio = await navigator.mediaDevices.getUserMedia({video:true});
          if(audioPermissio) {
            setaudioAvailable(true);
          }
          else{
            setaudioAvailable(false);
          }

          //share screen
          if(navigator.mediaDevices.getDisplayMedia){
            setscreenavailable(true);
          }
          else{
            setscreenavailable(false);
          }

          //check available send audio and video
          if(videoAvailable || audioAvailable){
            const userMediaStrem = await navigator.mediaDevices.getUserMedia({video:videoAvailable, audio:audioAvailable});
                      
             if(userMediaStrem){
                window.localStream = userMediaStrem;
                
                if(localVideoRef.current){ //if UI render then on video
                    localVideoRef.current.srcObject = userMediaStrem;

                }
             }
          }

        }catch(err){
           console.log("error occurse",err);
        }
    }


    useEffect(() => {
       getPermission();
    }, []);

    
   let getUserMediaSuccess = (strem) =>{
/* when i stop my audio/ video then it close from all computer or 
      when i mute my audio then this mute from all computer*/

   }

    let getUserMedia = () =>{
    if((video && videoAvailable) || (audio && audioAvailable)){
        navigator.mediaDevices.getUserMedia({video:video, audio:audio})
        .then((getUserMediaSuccess)=>{})// TODO : getUserMeadia
        .then((g)=>{})
        .catch((e)=>{
          console.log(e);
        })
    } 
    else{
          try{
               let tracks = localVideoRef.current.srcObject.getTracks();//if any problem occurre then get tracks 
               tracks.forEach(track => track.stop());// stop all tracks
          } catch(e){

          }
    }
    }

    useEffect(() => {
        if(video !== undefined && audio !== undefined) {
             getMedia();
        }
    },[audio, video])

    let getMessageFromServer = (fromId, message) =>[

    ]

let connectToSocketServer = () => { 
     socketRef.current = io.connect(server_url, {secure: false})//connect to backend connectToSocketServer usinf io

    socketRef.current.on('signal',getMessageFromServer)//emmit message catch here
   
    socketRef.current.on("connect", ()=> { //connect

      socketRef.current.emit("join-call",window.location.href)

      socketIdRef.current = socketRef.current.id

    })
  
  }

    let getMedia = () => {
        setVedio(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let connect = () => {
      // for connect
      setaskForUsername(false);
      getMedia();
    }

    return (
        // <div>VedioMeeting Component{window.location.href}</div>  //where you now
        <div>
             {askForUsername === true ? 
             <div>
                <h2>Enter the lobby</h2>
                 
                <TextField id="outlined-basic" label="Outlined" variant="outlined" value={username} onChange={e => setUsername(e.target.value)}/>

                <Button variant="contained" onClick={connect}>Connect</Button>

                <div>
                    <video ref={localVideoRef} autoPlay muted></video>
                </div>
             </div>: <> </>}
        </div>
    )
}
