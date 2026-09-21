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
  <div className="w-full max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-8">Publish Video</h1>

    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video Title
          </label>
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="6"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
          />
        </div>

        <button
          onClick={publishVideo}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold text-white"
        >
          Publish Video
        </button>

      </div>
    </div>
  </div>
)
}

export default PublishVideo
