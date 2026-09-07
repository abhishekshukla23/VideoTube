import React from 'react'
import { Link } from 'react-router-dom'
import {useParams} from "react-router-dom"
import { useState,useEffect } from 'react'
import axios from 'axios'
const Channel = () => {
    const {channelId}=useParams()

    const [stats,setStats]=useState(null)
    const [videos,setVideos]=useState([])
    const [loading,setLoading]=useState(true)

   useEffect(()=>{
     
         const getChannelData=async ()=>{
            try {
                   const ChannelStats=await axios.get(
                 `http://localhost:8000/api/v2/dashboard/channel/${channelId}`,
          { withCredentials: true }
            )

            const getVideos= await axios.get(
                  `http://localhost:8000/api/v2/dashboard/channel/videos/${channelId}`,
          { withCredentials: true }
            )
            console.log("stats",ChannelStats.data)
            console.log("videos",getVideos.data)
            setStats(ChannelStats.data.data[0])
            setVideos(getVideos.data.data[0].owner)
            } catch (error) {
                console.log(error)
            }
           finally{
            setLoading(false);
           }

  
            
        }
            
     getChannelData()
   }
,
   [channelId])


if(loading)
{
    return <h2>Loading Channel...</h2>
}









  return (
    <div>
      <div>

        <img src={stats?.avatar}
        alt={stats?.username}
        width="100"
        height="100"
        
        />

        <h1>{stats?.username}</h1>

        <p>{stats?.totalSubscribers} Subscribers</p>
      </div>

      <div>
        <p>{stats?.totalVideos} Videos</p>
        <p>{stats?.totalViews} Views</p>

        <p>{stats?.totalLikes} Likes</p>


      </div>

      <h2>Videos</h2>

      {
        videos.map((video)=>(
            <div
            
            key={video._id}
            >
             <Link to={`/videos/${video._id}`}>
              <img
               src={video.thumbnail}
                alt={video.title}
                width="250"
              
                />

                <h3>{video.title}</h3>
                <p>{video.views}</p>

             </Link>
            </div>
        )

        )
      }
    </div>
  )
}

export default Channel
