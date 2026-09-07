import { BrowserRouter,Routes,Route
 } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Video from './pages/Video'
import Channel from './pages/Channel'
function App() {
    

  return (
<>

  <Navbar/>

   <Routes>
<Route path='/login' element={<Login/>}/>

<Route path='/register' element={<Register/>}/>

<Route path='/' element={<Home/>}/>

<Route path='/videos/:videoId'  element={<Video/>}> </Route>
<Route path='/channel/:channelId' element={<Channel/>}></Route>
   </Routes>
   </>
   
  )
}

export default App
