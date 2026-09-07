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
                    `http://localhost:8000/api/v2/playlist/${playlistId}`,
                    {
                        withCredentials: true
                    }
                );

                console.log(response.data.data);
                setPlaylist(response.data.data);

            } catch (error) {
                console.log(error);
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
                </div>
            ))}
        </div>
    );
};

export default PlaylistDetails;