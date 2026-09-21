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
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import Sidebar from './components/Sidebar'
function App() {
    

  return (
    
<div className="min-h-screen bg-gray-950 text-white">
   <Navbar />



<div className="flex">
    <Sidebar />



<main className="flex-1 p-6">
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
<Route  path='/dashboard' element={<Dashboard/>}></Route>
<Route path='/account' element={<Account/>}></Route>
   </Routes>

    </main>
   
</div>

  </div>
   
  )
}

export default App
