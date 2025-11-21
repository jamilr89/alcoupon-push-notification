
import React, { Context, useContext,useState } from 'react'

import { ColorModeContext, tokens } from '../theme';
import { Box, IconButton,useTheme ,Typography,Button} from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LanguageIcon from '@mui/icons-material/Language';
import Popover from '@mui/material/Popover';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import PersonIcon from '@mui/icons-material/Person';
import { LightModeOutlined } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
const Topbar = () => {
    const theme=useTheme();
    const axiosPrivate= useAxiosPrivate();
    const colors= tokens(theme.palette.mode)
    const colorMode= useContext(ColorModeContext)
    const auth= useAuth();
      const [anchorEl, setAnchorEl] = useState(null);
console.log("auth in topbar ",auth)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    try {
      await axiosPrivate.get('/auth/logout');
      // Implement your logout logic here
      auth.setAuth({});
      handleClose();  
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  const open = Boolean(anchorEl);
  const id = open ? 'user-control-popover' : undefined;
  return (
    
    // <Box display="flex" justifyContent="space-between" p={2}>
    //   <Box flex={1}></Box>
    //     <Box display="flex" justifyContent="space-between" p={2} alignSelf="flex-end"></Box>
    <AppBar position="static">
    <Toolbar>
      {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        My App
      </Typography> */}
      <Box sx={{ flexGrow: 1 }}></Box>
        <IconButton onClick={colorMode.toggleColorMode}>
         {colorMode==="light"? <DarkModeOutlinedIcon/>:<LightModeOutlined/>}
        </IconButton>
        <IconButton onClick={handleClick}>
          <PersonIcon/>
          </IconButton>
        <IconButton>
          <LanguageIcon/>

          </IconButton>
  </Toolbar>
  
   <Popover
  id={id}
  open={open}
  anchorEl={anchorEl}
  onClose={handleClose}
  anchorOrigin={{
    vertical: 'bottom', // Anchors the popover below the icon
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top', // Aligns the top of the popover with the anchor's bottom
    horizontal: 'right',
  }}
>
  <Box sx={{ padding: 2, minWidth: 200 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', padding: 1 }}>{auth?.auth?.user}</Typography>
    {/* Add your user control components here */}
    {/* <p>Control Option 1</p>
    <p>Control Option 2</p> */}
    {/* For example, a logout button */}
    <Button variant="contained" onClick={handleLogout}>Logout</Button>
  </Box>
</Popover>
  </AppBar>
    // </Box>
  )
}

export default Topbar