import React from 'react'
import { useEffect,useState } from 'react'
import axios from "axios"


const Tweets = () => {
    const [tweets,setTweets]=useState([])
    const [content,setContent]=useState("")
    const [loading,setLoading]=useState(true)
   const [tweetLike,setTweetLike]=useState({})

  const createTweet=async ()=>{
    try {
        const response=await axios.post(
            "http://localhost:8000/api/v2/tweets/create",
                    {
                        content:content
                    },
                    {
                        withCredentials:true

                    }
        )
        const newTweet=response.data.data;
        setTweets(
            prev=>[
                newTweet,
                ...prev
            ]
        )
        setContent("");
    } catch (error) {
        console.log(error)
    }
  }
    useEffect(
        ()=>{
            const getTweets=async()=>{
    try {
          const response = await axios.get(
                    "http://localhost:8000/api/v2/tweets/getTweets",
                    {
                        withCredentials: true
                    }
                );
                setTweets(response.data.data)
    } catch (error) {
        console.log(error)
    
    }
    finally{
    setLoading(false)
    }
}
      getTweets()  },
        
    [])

    if(loading){
        return (
            <div>
                Loading tweets...
            </div>
        )
    }

    const updateTweet=async (item)=>{

        const updatedContent=prompt("enter new content",item.content)
        if(updatedContent===null) return;
        try {
            const response=await axios.patch(
                 `http://localhost:8000/api/v2/tweets/update/${item._id}`,
                 {
                    content:updatedContent
                 }
                 ,
                    {
                        withCredentials: true
                    }
            )
            const newContent=response.data.data;
            setTweets(
                prev=>(
                    prev.map(
                        prevTweet=>
                            prevTweet._id===item._id?newContent:prevTweet
                    )
                )
            )
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTweet=async (item)=>{
        try {
            const response=await axios.delete(
                 `http://localhost:8000/api/v2/tweets/deleteTweet/${item._id}`,
                    {
                        withCredentials: true
                    }
            )
            const leftContent=response.data.data;
            setTweets(
                prev=>(
                    prev.filter(
                        prevTweet=>prevTweet._id!==leftContent._id
                    )
                )
            )
        } catch (error) {
            console.log(error)
        }
    }

const handleTweetLike= async (tweetId)=>{
   try {
    const response=await axios.post(
          `http://localhost:8000/api/v2/likes/toggle/t/${tweetId}`,
          {},
          {
            withCredentials:true
          }
    )
    console.log(response.data)
    setTweetLike(
        prev=>({
            ...prev,
            [tweetId]:!prev[tweetId]
        })
    )
   } catch (error) {
    console.log(error)
   }
}







  return (

  <div className="w-full max-w-3xl mx-auto">

    <h1 className="text-3xl font-bold mb-8">
      Community
    </h1>

   
    <div className="p-5 bg-gray-900 rounded-xl border border-gray-800 mb-8">

      <h2 className="text-lg font-semibold mb-4">
        What's on your mind?
      </h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows="4"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500 resize-none"
      />

      <div className="flex justify-end mt-3">

        <button
          onClick={createTweet}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
        >
          Post
        </button>

      </div>

    </div>

    
    <h2 className="text-2xl font-bold mb-5">
      Tweets
    </h2>

    <div className="space-y-4">

      {tweets.map((tweet) => (

        <div
          key={tweet._id}
          className="p-5 bg-gray-900 rounded-xl border border-gray-800"
        >

          <p className="text-gray-200 text-lg whitespace-pre-wrap">
            {tweet.content}
          </p>

          <div className="flex gap-3 mt-5">

            <button
              onClick={() => updateTweet(tweet)}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm"
            >
              Edit
            </button>

            <button
              onClick={() => deleteTweet(tweet)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm"
            >
              Delete
            </button>

            <button
              onClick={() => handleTweetLike(tweet._id)}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm"
            >
              {tweetLike[tweet._id] ? "Unlike" : "Like"}
            </button>

          </div>

        </div>

      ))}

    </div>

  </div>
)
  
}

export default Tweets
