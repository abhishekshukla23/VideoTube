import axios from "axios";
import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
const Home = () => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getVideos = async () => {
            try {
                console.log("FETCHING VIDEOS");

                const response = await axios.get(
                    "http://localhost:8000/api/v2/videos"
                );

                console.log("VIDEO RESPONSE:", response.data);

                setVideos(response.data.data);

            } catch (error) {
                console.log("VIDEO ERROR:", error);

            } finally {
                setLoading(false);
            }
        };

        getVideos();

    }, []);

    if (loading) {
        return <h2>Loading Videos..</h2>;
    }

    return (
        <div>
            <h1>Home</h1>

            {
                videos.map((video) => (
                  <VideoCard
                  key={video._id}
                  video={video}
                  />
                ))
            }
        </div>
    );
};

export default Home;