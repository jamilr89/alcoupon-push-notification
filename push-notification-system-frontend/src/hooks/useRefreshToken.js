import axios from "../api/axios";
import useAuth from "./useAuth";


const useRefreshToken = () =>
{
    const {setAuth}=useAuth();

    const refreshToken = async()=>{
     try {   const response = await axios.get('/auth/refresh',
            { 
                withCredentials: true
            }
        )

    setAuth ((prev)=>{
       return {...prev,accessToken:response?.data?.token,user:response?.data?.username,roles:response?.data?.roles}
        
    })
    return response?.data?.token
}
catch (error) {
    console.error("Failed to fetch refresh token:", error);
    if (error?.response?.status === 401||error?.response?.status === 403){
    setAuth({});
    return null
}    
}

}
return refreshToken;
}

export default useRefreshToken