import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState,useEffect} from 'react'
import { useAuth } from '../context/AuthContext';



const Video = () => {

    const [playlist,setPlaylist]=useState([])
    const {videoId}=useParams();
    const [commentContent,setCommentContent] =useState({
        content:""
    })
    const [comments,setComments]=useState([])
    const [video,setVideo]=useState(null);
 const {user}=useAuth()

    const [loading,setLoading]=useState(true);
   const [like,setLike]=useState(false);

   const [editComment,setEditComment]=useState(null)

   const[editContent,setEditContent]=useState("")

   const [subscribed,setSubscribed]=useState(false)

   const getPlaylist= async () => {
     console.log("getPlaylist clicked");
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v2/playlist/getPlaylist/`,
      {
        withCredentials: true
      }
    );

    setPlaylist(response.data.data);
  } catch (error) {
    console.log(error);
  }
};


  
   const handleComment=(e)=>{
    setCommentContent(
        {
            ...commentContent,
            [e.target.name]:e.target.value

        }
    )
   }
 useEffect(()=>{
   const getVideo=async ()=>{
    try {
         const response = await axios.get(
                    `http://localhost:8000/api/v2/videos/${videoId}`,
                    {
                        withCredentials:true
                    }
                );

                console.log(response.data);
                setVideo(response.data.data);
               
                const subscriptionResponse = await axios.get(
    `http://localhost:8000/api/v2/subscription/s/${user._id}`,
    {
        withCredentials: true
    }
);

const subscriptions = subscriptionResponse.data.data;

const alreadySubscribed = subscriptions.some(
    subscription =>
        subscription.channel.toString() ===
        response.data.data.owner._id.toString()
);

setSubscribed(alreadySubscribed);
                



                const commentResponse = await axios.get(
    `http://localhost:8000/api/v2/comments/getComments/${videoId}`,
    {
        withCredentials: true
    }
);
console.log(commentResponse.data)

setComments(commentResponse.data.data);


    } catch (error) {
        console.log(error)
    }
    finally{
        setLoading(false)
    }
   }

if(user){
  getVideo()
}

 },
 [videoId,user]
)

const handleLike=async()=>{
    try {
        const response=await axios.post(
`http://localhost:8000/api/v2/likes/toggle/v/${videoId}`,
{},
{
    withCredentials:true
}
        )
        const isLiked=response.data.data
        setLike(isLiked)

        setVideo(prev=>({
            ...prev,
            likesCount:isLiked
            ? prev.likesCount+1
            :prev.likesCount-1
        }))
    } catch (error) {
        console.log(error)

    }
}
const DoComment=async ()=>{
    try {
        const addComment=await axios.post(
            `http://localhost:8000/api/v2/comments/addComment/${videoId}`,
            commentContent,
           {
            withCredentials:true
           }
        )
        const newComment=addComment.data.data
    setComments(
        prevComment=>[
            newComment,
            ...prevComment
        ]
    )

    setCommentContent({
        content:""
    })
        console.log(addComment.data)
    } catch (error) {
        console.log(error)
        
    }
}


const handleUpdateComment=async (commentId,editContent)=>{
    try {
        const response=await axios.patch(
              `http://localhost:8000/api/v2/comments/updateComment/${commentId}`,
            {
               content: editContent
            },
            {
                withCredentials: true
            }
        )

        const updatedComment=response.data.data;
        setComments(
            prevComments=>
                prevComments.map(comment=>
                    comment._id===updatedComment._id
                    ?{
                        ...comment,
                        content:updatedComment.content
                    }
                    :comment

                )
        )
        setEditComment(null)
setEditContent("")

    } catch (error) {
        console.log(error)
    }
}

const handleCommentDelete=async (commentId)=>{
    try {
        const response=await axios.delete(
         `http://localhost:8000/api/v2/comments/deleteComment/${commentId}`,
            {
                withCredentials: true
            }
        );
    setComments(
        prevComment=>
            prevComment.filter(
                comment=> comment._id!=commentId
            )
    )


    } catch (error) {
        console.log(error)
    }
}

const handleSubscribe= async ()=>{
    try {
       const response=await axios.post(
        `http://localhost:8000/api/v2/subscription/s/${video.owner._id}`,
            {},
            {
                withCredentials: true
            }
       )

       console.log(response)
   if(response.data.message==="subscribed"){
    setSubscribed(true)
   }
   else{
    setSubscribed(false)
   }
       
    } catch (error) {
        console.log(error)
    }
}


const addtoPlaylist=async (playlistId)=>{
    try {
        const response=await axios.patch(
            `http://localhost:8000/api/v2/playlist/add/${playlistId}/${videoId}`,
      {},
      {
        withCredentials: true
      }
        )
        console.log(response)
        alert("video added to playlist")
    } catch (error) {
        console.log(error)
    }
}



if(loading){
    return <h2>Loading Video..</h2>
}



  return (
    <div>
        <video
        src={video.videoFile}
             controls
            width="700"
        />
      <h1>{video.title}</h1>
      <p>{video.views}</p>
      <p>{video.likesCount}</p>
      <p>Uploaded On:{new Date(video.createdAt).toLocaleDateString()}</p>
      <Link to={`/channel/${video.owner._id}`}>
         {video.owner?.username}
      </Link>
      <button onClick={handleSubscribe}>
        {
            subscribed?"Unsubsribe":"Subscribe"
        }
      </button>
      <p>{video.description}</p>
      <button onClick={handleLike}>
        {like ? "👎 Unlike" : "👍 Like"}
      </button>

      <button onClick={getPlaylist}>
        Add to Playlist
      </button>
      
      <div>
        {
            playlist.map((item)=>(
                <div key={item._id}>
                    <p>{item._id}</p>
                    <p>{item.name}</p>
                <button onClick={()=>addtoPlaylist(item._id)}>
                    Add
                </button>
                </div>
            ))
        }
      </div>
      
      <h2>Comments</h2>

      {
        comments.map((comment)=>{
            const isOwner=
            user?._id===comment.ownerDetails?.[0]?._id?.toString()
                  return (
                <div key={comment._id}>
                    <p>{comment.ownerDetails?.[0]?.username}</p>
                {editComment===comment._id ?
                (
                    <>
                    
                    <input type="text" 
                    
                     value={editContent}
                    
                    onChange={(e)=>setEditContent(e.target.value)}
                    
                    />

                    <button onClick={()=>handleUpdateComment(comment._id,editContent)}>
                        Save
                    </button>

                    <button onClick={()=>{
                        setEditComment(null)
                        setEditContent("")
                    }}>
                        Cancel
                    </button>
                    </>
                ):
                (
                    <>
                    <p>{comment.content}</p>
                  {isOwner && (
                    <>
                    <button onClick={()=>{
                        setEditComment(comment._id)
                        setEditContent(comment.content)
                    }}>
                        Edit
                    </button>

                    <button onClick={()=>handleCommentDelete(comment._id)}>
                        Delete
                    </button>
                    </>
                )}
                </>
                
                
            )
                
                }
                </div>
                  )  
})
      }



      <input type="text"  
       placeholder="say something"
       name="content"
       onChange={handleComment}
      />
      <button onClick={DoComment}>
        Comment
      </button>

    </div>

  )
}

export default Video
