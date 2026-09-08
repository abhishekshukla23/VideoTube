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
        <div>
            <h1>{playlist.name}</h1>
            <p>{playlist.description}</p>

            <h2>Videos</h2>

            {playlist.videos?.map((video) => (
                <div key={video._id}>
                    <Link to={`/video/${video._id}`}>
                        <h3>{video.title}</h3>
                    </Link>

                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        width="200"
                    />
                    <button onClick={()=>removeVideo(playlistId,video._id)}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PlaylistDetails;