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
    <div>
      <h1>Community</h1>

      <input type="text"
      value={content}
      onChange={(e)=>setContent(e.target.value)}
      placeholder='Whats on your mind'
       />

       <button onClick={createTweet}>
        Post
       </button>

       <h2>
        Tweet
       </h2>

       {
        tweets.map((
            tweet
        )=>(
           <div key={tweet._id}>
            <p>{tweet.content}</p>

            <button onClick={()=>updateTweet(tweet)}>
                Edit
            </button>
            <button onClick={()=>deleteTweet(tweet)}>
                Delete
            </button>
            <button onClick={()=>handleTweetLike(tweet._id)}>
                {tweetLike[tweet._id]?"Unlike":"Like"}
            </button>
           </div>

        )
    )
       }
    </div>
  )
}

export default Tweets
