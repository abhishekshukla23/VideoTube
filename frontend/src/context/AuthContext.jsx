import { createContext,useState,useContext,useEffect} from "react";
import axios from "axios";

const AuthContext=createContext()

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)
   
   useEffect(()=>{
       const getCurrentUser=async ()=>{
        try {
            const response=await axios.get(
                  "http://localhost:8000/api/v2/users/get-user",
                    { withCredentials: true }
                );
            setUser(response.data.data)
        } catch (error) {
             setUser(null)
        }
        finally{
                setLoading(false)
        }
       }
       getCurrentUser();
   },
   []
)
const login = async (formData) => {
    const response = await axios.post(
        "http://localhost:8000/api/v2/users/login",
        formData,
        { withCredentials: true }
    );

    setUser(response.data.data.user);

    return response.data;
};


  const logout = async () => {
        const response = await axios.post(
            "http://localhost:8000/api/v2/users/logout",
            {},
            { withCredentials: true }
        );

        setUser(null);

        return response.data;
    };


    return (
        <AuthContext.Provider value={{user,setUser,loading,logout,login}}>
            {children}
        </AuthContext.Provider>
    )
}





export const useAuth=()=>{
    return useContext(AuthContext)
}
