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
   <div>
     <h1>Register</h1>
     <form onSubmit={handleSubmit}>
        <input type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
    
        />
          <input type="text"
        name="fullname"
        placeholder="fullname"
        value={formData.fullname}
        onChange={handleChange}
    
        />


    <input 
     type="email"
     name="email"
     placeholder='Email'
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

    <label>Avatar</label>
    <input type="file"
    accept='image/*'
    onChange={(e)=>setAvatar(e.target.files[0])}
    
    />

    <label>Cover Image</label>

    <input type="file" 
    accept='image/*'
    onChange={(e)=>e.target.files[0]}
    
    
    />

  <button  type='submit'>
    Register
  </button>
     </form>
   </div>
  )
}

export default Register
