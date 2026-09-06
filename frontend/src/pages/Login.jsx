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
    <div>
         <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>

      </form>

      <p>
        Don't have an account?
        <button onClick={()=>navigate("/register")}>
            Register
        </button>
      </p>

      
    </div>
  )
}

export default Login
