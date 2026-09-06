import React from 'react'
import {Link} from "react-router-dom"
const VideoCard = ({video}) => {
  return (
     <Link to={`/videos/${video._id}`}>
    <div>
       
      <img src={video.thumbnail}
      alt={video.title}
      width="300"
       />


       <h3>{video.title}</h3>
       <p>{video.description}</p>
       <p>{video.views}</p>
       <p>{video.ownerName}</p>
    </div>
    </Link>
  )
}

export default VideoCard
