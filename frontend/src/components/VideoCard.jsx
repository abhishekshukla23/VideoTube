import React from 'react'
import {Link} from "react-router-dom"
const VideoCard = ({video}) => {
  return (
    <Link to={`/videos/${video._id}`}>
  <div className="group cursor-pointer">

   
    <div className="overflow-hidden rounded-xl bg-gray-900">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full aspect-video object-cover group-hover:scale-105 transition duration-300"
      />
    </div>

   
    <div className="mt-3">
      <h3 className="text-lg font-semibold text-white line-clamp-2">
        {video.title}
      </h3>

      <p className="text-sm text-gray-400 mt-1 line-clamp-1">
        {video.ownerName}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {video.views} views
      </p>
    </div>

  </div>
</Link>
  )
}

export default VideoCard
