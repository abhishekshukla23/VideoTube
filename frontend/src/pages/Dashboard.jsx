import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const {user}=useAuth()
    const [videos,setVideo]=useState([])
const [stats,setStats]=useState(null)

const navigate=useNavigate()
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
   <div className="w-full">

  <h1 className="text-3xl font-bold mb-8">
    Dashboard
  </h1>

  {stats && (
    <>
      {/* Channel header */}
      <div className="flex items-center gap-4 mb-8 p-6 bg-gray-900 rounded-xl border border-gray-800">
        <img
          src={stats.avatar}
          alt={stats.username}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <h2 className="text-2xl font-semibold">
            Welcome, {stats.username}
          </h2>
          <p className="text-gray-400">
            Here's an overview of your channel
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-gray-400">
            Total Videos
          </h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalVideos}
          </p>
        </div>

        <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-gray-400">
            Total Views
          </h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalViews}
          </p>
        </div>

        <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-gray-400">
            Total Likes
          </h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalLikes}
          </p>
        </div>

        <div className="p-5 bg-gray-900 rounded-xl border border-gray-800">
          <h3 className="text-gray-400">
            Subscribers
          </h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalSubscribers}
          </p>
        </div>

      </div>

      {/* Your videos */}
      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-5">
          Your Videos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {videos.map((video) => (
            <div
              key={video._id}
              className="p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition"
            >
              <h3 className="font-semibold text-lg">
                {video.title}
              </h3>

              <p className="text-gray-400 mt-2">
                {video.views} views
              </p>
            </div>
          ))}

        </div>

      </div>
    </>
  )}

  {/* Quick Actions */}
  <div className="mt-10">

    <h2 className="text-2xl font-bold mb-5">
      Quick Actions
    </h2>

    <div className="flex flex-wrap gap-3">

      <button
        onClick={() => navigate('/publish')}
        className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
      >
        Upload Video
      </button>

      <button
        onClick={() => navigate('/playlist')}
        className="px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-medium"
      >
        Create Playlist
      </button>

      <button
        onClick={() => navigate('/tweets')}
        className="px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-medium"
      >
        Create Tweet
      </button>

    </div>

  </div>

</div>
  )
}

export default Dashboard
