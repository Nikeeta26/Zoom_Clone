import React, { useEffect, useRef } from "react";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
           console.log("error occurse"+err);
        }
    }


    useEffect(() => {
       getPermission();
    }, []);

    let getUserMedia = () =>{
    if((video && videoAvailable) || (audio && audioAvailable)){
        navigator.mediaDevices.getUserMedia({video:video, audio:audio})
        .then(getUserMedia)
    }
    }

    useEffect(() => {
        if(video !== undefined && audio !== undefined) {
             getUserMedia();
        }
    },[audio, video])


    let getMedia = () => {
        setVedio(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }
    return (
        // <div>VedioMeeting Component{window.location.href}</div>  //where you now
        <div>
             {askForUsername === true ? 
             <div>
                <h2>Enter the lobby</h2>
                 
                <TextField id="outlined-basic" label="Outlined" variant="outlined" value={username} onChange={e => setUsername(e.target.value)}/>

                <Button variant="contained">Connect</Button>

                <div>
                    <video ref={localVideoRef} autoPlay muted></video>
                </div>
             </div>: <> </>}
        </div>
    )
}