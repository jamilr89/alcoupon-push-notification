
import {createContext,useEffect,useState } from "react";
import axios from "../api/axios";

const AuthContext=createContext({})
export const AuthProvider=({children})=>{
    const [auth,setAuth]=useState({})
    const [isLoading,setLoading]=useState(true);


    useEffect(()=>{


        const fetchAuth = async () => {
            try {
                 const response = await axios.get('/refresh',
                            { 
                                withCredentials: true
                            }
                        )
                
                    setAuth ((prev)=>{
                       return {...prev,accessToken:response?.data?.token,user:response?.data?.username,roles:response?.data?.roles}
                        
                    })
            } catch (error) {
                console.error("Failed to fetch auth:", error);
            } finally {
                setLoading(false);
        }
        }
      


        if (!auth?.accessToken) {
            fetchAuth();}

    },[])


    const logout = async () => {
    try {
    //   await axios.post('/api/logout', {}, { withCredentials: true }); // Server clears the cookie
      setAuth({});
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
    return  <AuthContext.Provider value = {{
        auth,
        setAuth,
        logout,
        isLoading
    }}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext;


