
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
      <nav>
        <h2>
            VideoTube
        </h2>

        <input type="text" 
        placeholder='Search Videos'
        
        />
        {
          loading?(
            <span>Loading....</span>
          ):
            user ?(
                  <>
                    <span>{user.username}</span>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                  </>
            ):(
                <>
                <button onClick={()=>navigate("/login")}>
                    Login
                </button>

                <button onClick={()=>navigate("/register")}>
                    Register
                </button>


                </>

            )
        }

      </nav>
  )
}

export default Navbar
