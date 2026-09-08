import React from 'react'
import { Link } from 'react-router-dom'
import { useState,useEffect } from 'react'
import axios from 'axios'
const Playlist = () => {
  const [playlist,setPlaylist]=useState([])
  const [loading,setLoading]=useState(true)
    const [createPlaylist,setCreatePlaylist]=useState(
       { name:"",
        description:""}
    )


    useEffect(()=>{
       const getPlaylist=async ()=>{
        try {
          const response=await axios.get(
             `http://localhost:8000/api/v2/playlist/getPlaylist/`,
             {
              withCredentials:true
             }
          )
          setPlaylist(response.data.data)
        } catch (error) {
          console.log(error)
        }
        finally{
          setLoading(false)
        }
       }
       getPlaylist()
    }
    
,

    [])

    if(loading){
      return (
        <div>
          Loading Playlist..
        </div>
      )
    }









    const handleInput = (e)=>{
        setCreatePlaylist({
            ...createPlaylist,
           [ e.target.name]:e.target.value,
        }
        )
    }

    const formPlaylist=async ()=>{
       try {
         const response =await axios.post(
              `http://localhost:8000/api/v2/playlist/create/`,
              {
                name:createPlaylist.name,
                description:createPlaylist.description
              },
              {
                withCredentials:true
              }
            
        )
        const newPlaylist=response.data.data;

        setPlaylist(
          prevPlaylist=>
          [
            ...prevPlaylist,
            newPlaylist
          ]
        )
        alert("playlist created")
         console.log(response)
       } catch (error) {
        console.log(error)
       }

    }

    
    const deletePlaylist=async(playlistId)=>{
      try {
        const response=await axios.delete(
          `http://localhost:8000/api/v2/playlist/delete/${playlistId}`,
          {
            withCredentials:true
          }
        )
        setPlaylist(
          prev=>(
           prev.filter(item=>item._id!==playlistId)
          )
        )
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    












  return (
    <div>
      <input type="text" 
      name="name" 
      value={createPlaylist.name}
       onChange={handleInput}
      />

      <input type="text" 
       name="description"
       value={createPlaylist.description}
      onChange={handleInput}
      

      />

      <button onClick={formPlaylist}>
        Create Playlist
      </button>


  <h1>Created Playlists</h1>
      <div>
      {
        playlist.map((item)=>(
           <div key={item._id}>
  <Link to={`/playlist/${item._id}`}>
   <h2>{item.name}</h2>
            <p>{item.description}</p>
  </Link>
  <button onClick={()=>deletePlaylist(item._id)}>
    Delete
  </button>
           
           </div>
        ))
      }

      </div>
    </div>

    
  )
}

export default Playlist
