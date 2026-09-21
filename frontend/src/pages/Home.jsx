import axios from "axios";
import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
const Home = () => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
const [search,setSearch]=useState("")
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
 const handleSearch=async ()=>{
    try {
          const response=await axios.get(
              `http://localhost:8000/api/v2/videos?query=${search}`
          )
          console.log(response)
          setVideos(response.data.data)
    } catch (error) {
        console.log(error)
    }
 }
    return (
        <div>
            <h1>Home</h1>


            <input type="text"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            onKeyDown={(e)=>{
                if(e.key==='Enter') handleSearch()
            }}
            placeholder="Search Videos"
            
            
            
            />
            <button onClick={handleSearch}>
                Search
            </button>

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