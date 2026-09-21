
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import axios from "axios";

const Navbar = () => {
    console.log("navbar is running")
    const navigate=useNavigate();

   const {user,loading,logout}=useAuth()

const handleLogout=async () =>{
    try {
       
        await logout();
        alert("logged out successfully")
        navigate("/login")
    } catch (error) {
        console.log(error)
        alert(
            error.response?.data?.message|| "Logout Failed"
        )
    }
}


















  return (
      <nav className="flex items-center justify-between px-6 py-3 bg-gray-900 text-white shadow-md">
  
  <h2
    className="text-2xl font-bold cursor-pointer"
    onClick={() => navigate("/")}
  >
    VideoTube
  </h2>

  
  <input
    type="text"
    placeholder="Search Videos"
    className="w-96 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
  />

 
  <div className="flex items-center gap-4">
    {loading ? (
      <span className="text-gray-400">Loading...</span>
    ) : user ? (
      <>
        <span className="font-medium">
          {user.username}
        </span>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Register
        </button>
      </>
    )}
  </div>
</nav>
  )
}

export default Navbar
