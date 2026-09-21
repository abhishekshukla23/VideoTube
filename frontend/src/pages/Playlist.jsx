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

    const editPlaylist=async (item)=>{
      const name=prompt("Enter new Playlist Name",item.name);
      const description=prompt(
        "Enter new Playlist description",
        item.description
      )

      if(name===null || description===null){
        return ;
      }
      

      try {
        const response=await axios.patch(
             `http://localhost:8000/api/v2/playlist/update/${item._id}`,
            {
                name,
                description
            },
            {
                withCredentials: true
            }
        )

        const updatedPlaylist=response.data.data

        setPlaylist(
          prev=>
            prev.map(
              playlist=>
                playlist._id===item._id ? updatedPlaylist : playlist
            )
        )
      } catch (error) {

        console.log(error)
      }
    }
    












  return (
    <div className="w-full">

  <h1 className="text-3xl font-bold mb-8">
    Playlists
  </h1>

  {/* Create Playlist */}
  <div className="max-w-2xl p-6 bg-gray-900 rounded-xl border border-gray-800 mb-10">

    <h2 className="text-xl font-semibold mb-5">
      Create New Playlist
    </h2>

    <div className="space-y-4">

      <input
        type="text"
        name="name"
        value={createPlaylist.name}
        onChange={handleInput}
        placeholder="Playlist name"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
      />

      <input
        type="text"
        name="description"
        value={createPlaylist.description}
        onChange={handleInput}
        placeholder="Playlist description"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
      />

      <button
        onClick={formPlaylist}
        className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
      >
        Create Playlist
      </button>

    </div>

  </div>

  {/* Created Playlists */}
  <h2 className="text-2xl font-bold mb-5">
    Created Playlists
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

    {playlist.map((item) => (
      <div
        key={item._id}
        className="p-5 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition"
      >

        <Link to={`/playlist/${item._id}`}>
          <h2 className="text-xl font-semibold hover:text-blue-400 transition">
            {item.name}
          </h2>

          <p className="text-gray-400 mt-2 line-clamp-2">
            {item.description}
          </p>
        </Link>

        <div className="flex gap-3 mt-5">

          <button
            onClick={() => editPlaylist(item)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
          >
            Edit
          </button>

          <button
            onClick={() => deletePlaylist(item._id)}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Delete
          </button>

        </div>

      </div>
    ))}

  </div>

</div>
  )
}

export default Playlist
