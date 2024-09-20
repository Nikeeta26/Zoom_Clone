import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/landing';
import VideoMeeting from './pages/videoMeeting';
import Authentication from './pages/authentication'
import {Route,Routes,BrowserRouter as Router} from 'react-router-dom';
import { AuthProvider } from './contents/AuthContext';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
<Router>
  <AuthProvider>
  <Routes>
    <Route path='/'  element={<LandingPage/>} />

    <Route path='/auth' element={<Authentication />} />

    <Route path='/:url' element={< VideoMeeting/>} />

  </Routes>
  </AuthProvider>
</Router>
</div>
    </>
  )
}

export default App
