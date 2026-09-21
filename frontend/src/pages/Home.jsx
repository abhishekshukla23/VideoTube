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
      <div className="w-full">
  <h1 className="text-3xl font-bold mb-6">
    Home
  </h1>

  {/* Search */}
  <div className="flex gap-3 mb-8 max-w-2xl">
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch()
      }}
      placeholder="Search Videos"
      className="flex-1 px-5 py-3 rounded-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500"
    />

    <button
      onClick={handleSearch}
      className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition font-medium"
    >
      Search
    </button>
  </div>

  {/* Videos */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {videos.map((video) => (
      <VideoCard
        key={video._id}
        video={video}
      />
    ))}
  </div>
</div>
    )
};


export default Home;