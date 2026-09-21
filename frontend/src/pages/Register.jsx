import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Register = () => {

 const navigate=useNavigate();

  const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:"",
    fullname:""
  });
const [avatar,setAvatar]=useState(null);
const [coverImage,setCoverImage]=useState(null)
  const handleChange=(e)=>{
    setFormData(
        {
            ...formData,
            [e.target.name]:e.target.value,
        }
    )
  }

  const handleSubmit =async (e)=>{
    e.preventDefault();
  

   try {
    const data=new FormData()
    data.append("username",formData.username);
    data.append("fullname",formData.fullname);
    data.append("email",formData.email);
    data.append("password",formData.password);
    data.append("avatar",avatar)
    if(coverImage){
      data.append("coverImage",coverImage)
    }
    for (let pair of data.entries()) {
    console.log(pair[0], pair[1]);
}
    const response=await axios.post(
          "http://localhost:8000/api/v2/users/register",
        data
    );
    console.log(response.data)
    alert("Registration successfull")
    navigate("/login");
   } catch (error) {
    console.log(error)
    alert(error.response?.data?.message|| "Registration failed")
   }
  }



  return (
  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10">
    <div className="w-full max-w-md">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Create your account
        </h1>
        <p className="text-gray-400 mt-2">
          Join VideoTube today
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
      >
        <div className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full text-sm text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full text-sm text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold text-white"
          >
            Register
          </button>

        </div>
      </form>

      <p className="text-center text-gray-400 mt-6">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Login
        </button>
      </p>

    </div>
  </div>
)
}

export default Register
