import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PlaylistDetails = () => {
    const { playlistId } = useParams();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPlaylist = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v2/playlist/getPlaylistById/${playlistId}`,
                    {
                        withCredentials: true
                    }
                );

                console.log(response.data.data);
                setPlaylist(response.data.data);

            } catch (error) {
                  console.log("ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
            } finally {
                setLoading(false);
            }
        };

        getPlaylist();
    }, [playlistId]);

    if (loading) {
        return <div>Loading playlist...</div>;
    }

    if (!playlist) {
        return <div>Playlist not found</div>;
    }

    const removeVideo=async (playlistId,videoId)=>{
        try {
            const response=await axios.patch(
                          `http://localhost:8000/api/v2/playlist/remove/${playlistId}/${videoId}`,
                          {},
                
                {
                    withCredentials:true
                }
            )
            console.log(response.data)
            setPlaylist(
                prev=>(
                    {
                        ...prev,
                        videos:prev.videos.filter(video=>video._id!==videoId)
                    }
                )
            )
        } catch (error) {
            console.log(error

            )
        }
    }

    return (
       <div className="w-full">

  {/* Playlist header */}
  <div className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-800">

    <h1 className="text-3xl font-bold">
      {playlist.name}
    </h1>

    <p className="text-gray-400 mt-2">
      {playlist.description}
    </p>

  </div>

  {/* Videos */}
  <h2 className="text-2xl font-bold mb-5">
    Videos
  </h2>

  {playlist.videos?.length === 0 ? (
    <div className="p-8 bg-gray-900 rounded-xl border border-gray-800 text-center">
      <p className="text-gray-400">
        No videos in this playlist
      </p>
    </div>
  ) : (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {playlist.videos?.map((video) => (

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

            </div>

          </Link>

          <div className="px-4 pb-4">

            <button
              onClick={() => removeVideo(playlistId, video._id)}
              className="w-full py-2 rounded-lg bg-gray-800 hover:bg-red-600 transition"
            >
              Remove
            </button>

          </div>

        </div>

      ))}

    </div>

  )}

</div>
    );
};

export default PlaylistDetails;