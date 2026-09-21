import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
const History = () => {
 const [history,setHistory]=useState([])
 const [loading,setLoading]=useState(false)


 useEffect(()=>{
          
 const geteHistory=async ()=>{
    try {
        const response=await axios.get(
              "http://localhost:8000/api/v2/users/history",
          {
            withCredentials: true,
          }
        )
        setHistory(response.data.data)
        console.log(response)
    } catch (error) {
        console.log(error)
    }
 }
geteHistory()
 },[])

if(loading){
    return(
        <div>Fetching History..</div>
    )
}

const removeVideo=async (video_id)=>{
    try {
        const response=await axios.delete(
             `http://localhost:8000/api/v2/videos/removeFromHistory/${video_id}`,
             {
                withCredentials:true
             }
     
        )
           setHistory(
            prevHistory=>prevHistory.filter(
                video=>video._id!==video_id
            )
        )
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}






  return (
  
  <div className="w-full">

    <h1 className="text-3xl font-bold mb-8">
      Watch History
    </h1>

    {history.length === 0 ? (
      <div className="p-8 rounded-xl bg-gray-900 border border-gray-800 text-center">
        <p className="text-gray-400">
          No watch history
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {history.map((video) => (
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

                <h3 className="font-semibold text-lg line-clamp-2">
                  {video.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  {video.owner?.username}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {video.views} views
                </p>

              </div>

            </Link>

            <div className="px-4 pb-4">

              <button
                onClick={() => removeVideo(video._id)}
                className="w-full py-2 rounded-lg bg-gray-800 hover:bg-red-600 transition text-sm"
              >
                Remove from History
              </button>

            </div>

          </div>
        ))}

      </div>
    )}

  </div>
)

}

export default History
