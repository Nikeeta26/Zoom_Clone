import React from 'react';
import "../App.css";
import { Link } from 'react-router-dom';

export default function landingPage(){
    return(
        <div className='landindPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>Apna Video call
                    </h2>
                </div>

                <div className='navList'>
                    <p >Join as Guest</p>
                    <p>Register</p>
                    {/* <button>Login</button> */}
                    <div role='button'>
                        <p>Login</p>
                    </div>
                </div>

            </nav>

            <div className='landingMainContainer'>
                  <div >
                    <h1><span style={{color:"#FF9839"}}>Connect</span> with your loved Ones</h1>
                    <p>Cover a distance by Apna Video Call</p>
                    <div role='button'>
                        <Link to={"/home"}>Get Started</Link>
                    </div>
                  </div>

                  <div>
                    <img src="/mobile.png"></img>
                  </div>
            </div>
        </div>
        
    )
}