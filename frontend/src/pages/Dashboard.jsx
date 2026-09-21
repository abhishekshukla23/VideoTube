import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const {user}=useAuth()
    const [videos,setVideo]=useState([])
const [stats,setStats]=useState(null)


const getStats=async ()=>{
    try {
        const response=await axios.get(
             `http://localhost:8000/api/v2/dashboard/stats/channel/${user._id}`,
            {
                withCredentials: true
            }
        )
        setStats(response.data.data[0])
        console.log(response.data.data)
        
    } catch (error) {
        console.log(error)
    }
}

const getVideos=async ()=>{
    try {
          const response = await axios.get(
      `http://localhost:8000/api/v2/dashboard/stats/channel/videos/${user._id}`,
      { withCredentials: true }
    )

    setVideo(response.data.data[0].owner);
    console.log(response.data.data)
    } catch (error) {
        console.log(error)
    }
}

useEffect(()=>{
    if(user){
        getStats()
        getVideos()
    }
},[user])







  return (
    <div>
        <h1>Dashboard</h1>
    {
        stats&&(
            <>
            
            <h2>
                Welcome, {stats.username}
            </h2>
             <img src={stats.avatar} alt={stats.username}/>

          <div>
               <div>
                <h3>Total Videos</h3>
                <p>{stats.totalVideos}</p>
               </div>

                 <div>
                        <h3>Total Views</h3>
                        <p>{stats.totalViews}</p>
                    </div>

                    <div>
                        <h3>Total Likes</h3>
                        <p>{stats.totalLikes}</p>
                    </div>

                    <div>
                        <h3>Subscribers</h3>
                        <p>{stats.totalSubscribers}</p>
                    </div>

<div>

</div>



          </div>


          <div>
            <h2>Your Videos</h2>

            {
                videos.map((video)=>(
                    <div key={video._id}>
                        <h3>{video.title}</h3>
                        <p>{video.views}</p>
                    </div>
                )
            )
            }
          </div>



            </>
        )
    }
    </div>
  )
}

export default Dashboard
