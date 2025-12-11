

import { ColorModeContext,useMode } from "./theme";
import { CssBaseline,ThemeProvider } from "@mui/material";
import Campaigns from "./screens/Campaigns";
import Settings from "./screens/Settings";
import AnalyticsScreen from "./screens/Analytics";
import ComposeMessage from "./screens/ComposeMessage"
import { Route, Routes } from "react-router";
import Login from "./screens/LoginScreen";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import RequireAuth from "./components/RequireAuth";
import UnauthorizedScreen from "./screens/Unauthorized";
import MainLayout from "./components/MainLayout";
import { Toaster } from "react-hot-toast";
import CreateUserPage from "./screens/createUsers";
import Users from "./screens/Users";
import { Navigate } from "react-router-dom";

function App() {
  const [theme,colorMode]= useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>

    <Toaster position="bottom-center"/>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        
        <CssBaseline>
          
    {/* <div className="app">
 
      <SideBar />
  <main className="content">
    <Topbar/> */}

    <Routes>
      
      <Route element={<MainLayout />} >
      <Route element={<RequireAuth allowedRoles={['user']} />}>
      <Route path="/" element={<Navigate to="/messages" replace />} />
      <Route path="/messages" element={<Campaigns/>} />
      </Route>
      <Route element={<RequireAuth allowedRoles={['admin','analyst']} />}>
      <Route path="/analytics" element={<AnalyticsScreen/>}/>
      </Route>
      <Route element={<RequireAuth allowedRoles={['admin']} />}>
      <Route path="/settings" element={<Settings/>}/>
      </Route>
       <Route element={<RequireAuth allowedRoles={['superAdmin']} />}>
      <Route path="/users" element={<Users/>}/>
      </Route>
      <Route element={<RequireAuth allowedRoles={['superAdmin']} />}>
      <Route path="/users/create-user" element={<CreateUserPage/>}/>
      <Route path="/edit-user/:id" element={<CreateUserPage/>}/>
      </Route>
         
      
      <Route element={<RequireAuth allowedRoles={['admin','sender']} />}>
      <Route path="messages/compose" element={<ComposeMessage/>}/>
      </Route>
      <Route path="/unauthorized" element={<UnauthorizedScreen/>}/>
 </Route>
      <Route path="/login" element={<Login />} />
      
     

    </Routes>
  {/* </main> */}
    {/* </div> */}
    </CssBaseline>
    </LocalizationProvider>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
