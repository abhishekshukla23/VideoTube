import { useParams, useSearchParams,useNavigate} from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState,useEffect} from 'react'
import { useAuth } from '../context/AuthContext';





const Video = () => {
    const navigate=useNavigate()
    const [editingVideo, setEditingVideo] = useState(false);
const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");
const [editThumbnail, setEditThumbnail] = useState(null);

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

   const [likeComment,setLikeComment]=useState({})
    
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

const removeVideo=async (videoId)=>{
    try {
        const response=await axios.delete(
             `http://localhost:8000/api/v2/videos/deleteVideo/${videoId}`,
            {
                withCredentials: true
            }
        )
        const removedVideo=response.data.data;
        navigate('/')
    } catch (error) {
        console.log(error)
    }
}
      const isOwner =
    user?._id?.toString() === video?.owner?._id?.toString();


if(loading){
    return <h2>Loading Video..</h2>
}


const editVideoDetails = async () => {
    try {
        const formData = new FormData();

        formData.append("title", editTitle);
        formData.append("description", editDescription);

        if (editThumbnail) {
            formData.append("thumbnail", editThumbnail);
        }

        const response = await axios.patch(
            `http://localhost:8000/api/v2/videos/updateVideo/${videoId}`,
            formData,
            {
                withCredentials: true
            }
        );

        console.log(response.data);
        const updatedVideo=response.data.data;
        setVideo(
            prev=>(
                {
                    ...prev,
                    title:updatedVideo.title,
                    description:updatedVideo.description,
                    thumbnail:updatedVideo.thumbnail
                }
            )
        )
        setEditingVideo(false)

    } catch (error) {
        console.log(error);
    }
};

const togglePublish=async ()=>{
    try {
        const response=await axios.patch(
             `http://localhost:8000/api/v2/videos/togglePublish/${videoId}`,
            {},
            {
                withCredentials: true
            }
        )
        const updateVideo=response.data.data;
        setVideo(
            prev=>(
                {
                    ...prev,
                    isPublished:updateVideo.isPublished
                }
            )
        )
        console.log(response.data.data)
    } catch (error) {
        console.log(error)
    }
}

const handleCommentLike=async (commentId)=>{
    try {
        const response=await axios.post(
             `http://localhost:8000/api/v2/likes/toggle/c/${commentId}`,
             {},{
                withCredentials:true
             }
        )
        console.log(response.data)
     setLikeComment(
        prev=>({
            ...prev,
            [commentId]:!prev[commentId]
        })
     )
    } catch (error) {
        console.log(error)
    }
}






  return (
  <div className="max-w-6xl mx-auto">

  {/* Video */}
  <div className="bg-black rounded-xl overflow-hidden">
    <video
      src={video.videoFile}
      controls
      className="w-full max-h-[650px]"
    />
  </div>

  {/* Title */}
  <h1 className="text-2xl md:text-3xl font-bold mt-5">
    {video.title}
  </h1>

  {/* Video stats */}
  <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-400">
    <span>{video.views} views</span>
    <span>•</span>
    <span>
      Uploaded On: {new Date(video.createdAt).toLocaleDateString()}
    </span>
  </div>

  {/* Channel + Subscribe */}
  <div className="flex items-center justify-between mt-5 pb-5 border-b border-gray-800">

    <Link
      to={`/channel/${video.owner._id}`}
      className="font-semibold text-lg hover:text-blue-400 transition"
    >
      {video.owner?.username}
    </Link>

    <button
      onClick={handleSubscribe}
      className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
    >
      {subscribed ? "Unsubscribe" : "Subscribe"}
    </button>

  </div>

  {/* Actions */}
  <div className="flex flex-wrap gap-3 mt-5">

    <button
      onClick={handleLike}
      className="px-5 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
    >
      {like ? "👎 Unlike" : "👍 Like"}
    </button>

    <button
      onClick={getPlaylist}
      className="px-5 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
    >
      Add to Playlist
    </button>

  </div>

  {/* Owner controls */}
  {isOwner && (
    <div className="mt-5 p-5 rounded-xl bg-gray-900 border border-gray-800">

      <h2 className="text-lg font-semibold mb-4">
        Video Management
      </h2>

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => removeVideo(video._id)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          Remove
        </button>

        <button
          onClick={() => {
            setEditingVideo(true)
            setEditTitle(video.title)
            setEditDescription(video.description)
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Edit
        </button>

        <button
          onClick={togglePublish}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
        >
          {video.isPublished ? "Unpublish" : "Publish"}
        </button>

      </div>

      {/* Edit form */}
      {editingVideo && (
        <div className="mt-5 p-5 bg-gray-950 rounded-xl">

          <h3 className="text-xl font-semibold mb-4">
            Edit Video
          </h3>

          <div className="space-y-4">

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Video title"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 outline-none focus:border-blue-500"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Video description"
              rows="5"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 outline-none focus:border-blue-500 resize-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditThumbnail(e.target.files[0])}
              className="w-full text-gray-400"
            />

            <div className="flex gap-3">

              <button
                onClick={editVideoDetails}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditingVideo(false)}
                className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )}

  {/* Description */}
  <div className="mt-6 p-5 rounded-xl bg-gray-900">
    <h2 className="font-semibold text-lg mb-2">
      Description
    </h2>

    <p className="text-gray-300 whitespace-pre-wrap">
      {video.description}
    </p>
  </div>

  {/* Playlist */}
  <div className="mt-6">

    {playlist.length > 0 && (
      <div className="p-5 rounded-xl bg-gray-900">

        <h2 className="text-xl font-semibold mb-4">
          Add to Playlist
        </h2>

        <div className="space-y-3">

          {playlist.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
            >

              <p>{item.name}</p>

              <button
                onClick={() => addtoPlaylist(item._id)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                Add
              </button>

            </div>
          ))}

        </div>

      </div>
    )}

  </div>

  {/* Comments */}
  <div className="mt-8">

    <h2 className="text-2xl font-bold mb-5">
      Comments
    </h2>

    {/* Add comment */}
    <div className="flex gap-3 mb-6">

      <input
        type="text"
        placeholder="Say something..."
        name="content"
        onChange={handleComment}
        className="flex-1 px-4 py-3 rounded-full bg-gray-900 border border-gray-700 outline-none focus:border-blue-500"
      />

      <button
        onClick={DoComment}
        className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition"
      >
        Comment
      </button>

    </div>

    {/* Comments list */}
    <div className="space-y-4">

      {comments.map((comment) => {

        const isOwner =
          user?._id === comment.ownerDetails?.[0]?._id?.toString()

        return (
          <div
            key={comment._id}
            className="p-4 rounded-xl bg-gray-900"
          >

            <p className="font-semibold">
              {comment.ownerDetails?.[0]?.username}
            </p>

            {editComment === comment._id ? (

              <div className="mt-3 space-y-3">

                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
                />

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      handleUpdateComment(comment._id, editContent)
                    }
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditComment(null)
                      setEditContent("")
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              <>
                <p className="text-gray-300 mt-2">
                  {comment.content}
                </p>

                {isOwner && (
                  <div className="flex gap-3 mt-3">

                    <button
                      onClick={() => {
                        setEditComment(comment._id)
                        setEditContent(comment.content)
                      }}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleCommentDelete(comment._id)
                      }
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        handleCommentLike(comment._id)
                      }
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      {likeComment[comment._id] ? "Unlike" : "Like"}
                    </button>

                  </div>
                )}

              </>

            )}

          </div>
        )
      })}

    </div>

  </div>

</div>

  )
}

export default Video
