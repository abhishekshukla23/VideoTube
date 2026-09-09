import { BrowserRouter,Routes,Route
 } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Video from './pages/Video'
import Channel from './pages/Channel'
import History from './pages/History'
import Playlist from './pages/Playlist'
import PlaylistDetails from './components/PlaylistDetails'
import Tweets from './components/Tweets'
import PublishVideo from './pages/PublishVideo'
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

<Route path='/history' element={<History/>}></Route>

<Route path='/playlist' element={<Playlist/>}></Route>

<Route path='playlist/:playlistId' element={<PlaylistDetails/>}></Route>

<Route path='/tweets' element={<Tweets/>}></Route>

<Route path='/publish' element={<PublishVideo/>}></Route>
   </Routes>



   </>
   
  )
}

export default App
