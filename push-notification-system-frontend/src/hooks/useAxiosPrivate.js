import useAuth from "./useAuth";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";

const useAxiosPrivate = ()=>{

    const refreshToken=useRefreshToken();
    const {auth}=useAuth();
useEffect (()=>{

    const requestIntercept= axiosPrivate.interceptors.request.use(
        config=>{
            if (!config.headers['Authorization']){
                config.headers['Authorization'] = `Bearer ${auth?.accessToken}`}
                return config
            },
            (error)=> Promise.reject(error)
    
    );
const responseIntercept= axiosPrivate.interceptors.response.use(
    response=> response,
    async (error) => {
        console.log("error in response interceptor "+JSON.stringify(error?.response))   
        const previousRequest =error?.config;
        if((error?.response?.status === 401||error?.response?.status === 403) && !previousRequest?.sent)
        {
            previousRequest.sent = true;
            const newAccessToken = await refreshToken();
            previousRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(previousRequest);
        }
        return Promise.reject(error)

    })


return ()=>{
    axiosPrivate.interceptors.response.eject(responseIntercept)
    axiosPrivate.interceptors.request.eject(requestIntercept)
}


},[refreshToken,auth])


    return axiosPrivate;

}


export default useAxiosPrivate
