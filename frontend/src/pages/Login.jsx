import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
const Login = () => {

 const navigate = useNavigate();
 const {login}=useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await login(formData)

      alert("Login successful");

      navigate("/");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };






















    
  return (
  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10">
    <div className="w-full max-w-md">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome Back
        </h1>
        <p className="text-gray-400 mt-2">
          Login to your VideoTube account
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
      >
        <div className="space-y-5">

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

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold text-white"
          >
            Login
          </button>

        </div>
      </form>

      <p className="text-center text-gray-400 mt-6">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-blue-400 hover:text-blue-300 font-medium ml-1"
        >
          Register
        </button>
      </p>

    </div>
  </div>
)
}

export default Login
