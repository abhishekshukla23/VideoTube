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
    <div>

     <h1>Watch History</h1>

     {
        history.length===0?(
            <p>No watch history</p>
        ):(
            history.map((video)=>(
                <div
                key={video._id}
                >
                <Link to={`/video/${video._id}`}>
                <img src={video.thumbnail} alt={video.title}  width="250"/>
                
                             <h3>
                                {video.title}
                             </h3>
                </Link>
                            <p>{video.views} views</p>
               <p>{video.owner?.username}</p>

               <button onClick={()=>{
                removeVideo(video._id)
               }}>
                Remove
               </button>
                </div>
            ))
        )
     }
      
     
    </div>
  )
}

export default History
