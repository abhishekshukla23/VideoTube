import React from 'react'
import { useState } from 'react'
import axios from "axios"

const PublishVideo =() => {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [videoFile, setVideoFile] = useState(null);
const [thumbnail, setThumbnail] = useState(null);

const publishVideo = async () => {
    try {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);

        const response = await axios.post(
            "http://localhost:8000/api/v2/videos/publish/",
            formData,
            {
                withCredentials: true
            }
        );

        console.log("video published", response.data);

    } catch (error) {
        console.log(error);
    }
};







  return (
    <div>
      <h1>
        Publish Video
      </h1>

       <input
                type="text"
                placeholder="Video title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />

            <br />

            <textarea
                placeholder="Video description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
            />

            <br />

            <label>Video:</label>
            <input type="file"
            accept='video/*'
            onChange={(e)=>setVideoFile(e.target.files[0])}
            />

            <br />

            <label>Thumbnail:</label>
            <input type="file" 
            accept='image/*'
            onChange={(e)=>setThumbnail(e.target.files[0])}
            
            />

            <br />

            <button onClick={publishVideo}>Publish</button>

    </div>
  )
}

export default PublishVideo
