

import useAuth from "../../hooks/useAuth.js";
import {useLocation , Navigate, Outlet} from 'react-router-dom';

const RequireAuth = ({allowedRoles}) => {
  console.log("in require auth "+JSON.stringify(allowedRoles))
    const {auth,isLoading}=useAuth();
    console.log("in require auth auth object"+JSON.stringify(auth))
    const location=useLocation();
    if (isLoading) {
    // While waiting for the server to confirm authentication, show a loading indicator.
    return <div>Loading...</div>;
  }
console.log("auth in require auth",JSON.stringify(auth));
     return (auth?.roles?.find(role=>allowedRoles?.includes(role))?
      <Outlet/>:
     auth?.user?<Navigate to="/unauthorized" state={{from:location}} replace/>
    :<Navigate to="/login" state={{from:location}} replace/>)
};

export default RequireAuth;
