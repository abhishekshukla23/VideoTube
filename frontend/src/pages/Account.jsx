import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
const Account = () => {
const [email,setEmail]=useState("")
const [fullname,setFullname]=useState("")
const [username,setUsername]=useState("")
const {user}=useAuth()
const handleUdpate=async (e)=>{
    e.preventDefault();


    try {
        const response=await axios.patch(
          `http://localhost:8000/api/v2/users/update-details/${user._id}`,{
            email,
            fullname,
            username
            
          },
          {
            withCredentials:true
          }
        )
        console.log(response.data.data)
        alert("Details Updated")
    } catch (error) {
        console.log(error)
    }
}



  return (
 
  <div className="w-full max-w-2xl mx-auto">

    <h1 className="text-3xl font-bold mb-8">
      Account Settings
    </h1>

    <form
      onSubmit={handleUdpate}
      className="p-6 bg-gray-900 rounded-xl border border-gray-800"
    >

      <div className="space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fullname
          </label>

          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
        >
          Update Account
        </button>

      </div>

    </form>

  </div>
)
 
}

export default Account
