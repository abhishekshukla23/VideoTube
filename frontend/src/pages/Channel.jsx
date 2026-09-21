import React from 'react'
import { Link } from 'react-router-dom'
import {useParams} from "react-router-dom"
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
const Channel = () => {

  const {user}=useAuth()
    const {channelId}=useParams()
    const [subscribed,setSubscribed]=useState(false)
    const [stats,setStats]=useState(null)

    const [videos,setVideos]=useState([])
    const [loading,setLoading]=useState(true)

   useEffect(()=>{
     
         const getChannelData=async ()=>{
          if(!user) return ;
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
          
            const subscriptionResponse=await axios.get(
                 `http://localhost:8000/api/v2/subscription/s/${user._id}`,
        { withCredentials: true }
            )

            const subscriptions=subscriptionResponse.data.data;
           
            const alreadySubscribed=subscriptions.some(
              (subs)=>
                subs.channel.toString()===channelId.toString()
            )

            setSubscribed(alreadySubscribed)


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
   [channelId,user])


if(loading)
{
    return <h2>Loading Channel...</h2>
}

const handleSubscribe=async ()=>{
 try {
   const response=await axios.post(
     `http://localhost:8000/api/v2/subscription/s/${channelId}`,
      {},
      { withCredentials: true }

  )
  if(response.data.message=="subscribed"){
    setSubscribed(true)
  }
  else{
    setSubscribed(false)
  }
 } catch (error) {
  console.log(error)
 }

}









  return (
  <div className="w-full max-w-6xl mx-auto">

    {/* Channel Header */}
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

        <img
          src={stats?.avatar}
          alt={stats?.username}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold">
            {stats?.username}
          </h1>

          <p className="text-gray-400 mt-2">
            {stats?.totalSubscribers} Subscribers
          </p>

          <button
            onClick={handleSubscribe}
            className="mt-4 px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>

      </div>
    </div>

    {/* Channel Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
        <p className="text-gray-400">Videos</p>
        <p className="text-3xl font-bold mt-2">
          {stats?.totalVideos}
        </p>
      </div>

      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
        <p className="text-gray-400">Views</p>
        <p className="text-3xl font-bold mt-2">
          {stats?.totalViews}
        </p>
      </div>

      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
        <p className="text-gray-400">Likes</p>
        <p className="text-3xl font-bold mt-2">
          {stats?.totalLikes}
        </p>
      </div>

    </div>

    {/* Videos */}
    <h2 className="text-2xl font-bold mb-5">
      Videos
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {videos.map((video) => (
        <div
          key={video._id}
          className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition"
        >
          <Link to={`/videos/${video._id}`}>

            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full aspect-video object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-blue-400 transition">
                {video.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                {video.views} views
              </p>
            </div>

          </Link>
        </div>
      ))}

    </div>

  </div>
)
}

export default Channel
