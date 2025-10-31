import { useState } from 'react'
import {Sidebar, Menu,MenuItem, sidebarClasses} from "react-pro-sidebar"
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import  MenuOutlinedIcon  from '@mui/icons-material/MenuOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Box, collapseClasses, IconButton, Typography, useTheme } from '@mui/material';
import {Link}from "react-router"
import {tokens} from "../theme"
import { Padding } from '@mui/icons-material';


const Item = ({ title, to, icon, selected, setSelected , isCollapsed,setIsCollapsed}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
     <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}> 
    <MenuItem 
    style={{ backgroundColor: selected === title ? colors.primary[500] : 'transparent',}} // Default background color}}
    active={selected===title}
     onClick={() => setSelected(title)}
    icon={icon}
    >
     
    <Box
  style={{display:"flex",flexDirection:"row",marginLeft:"10px"}}>


{
!isCollapsed&&
    <Typography style={{marginLeft:10}}>{title}</Typography>}

    </Box>
  
    </MenuItem>   </Link>
  );
};




export const SideBar = () => {
  const theme=useTheme();
  const colors= tokens(theme.palette.mode)
  const [isCollapsed,setIsCollapsed]=useState(false);
  const [selected,setSelected]=useState("Dashboard") 
  return (

<Box
 sx={{
  "& .pro-sidebar-inner": {
    backgroundColor: "transparent !important",
  },
  "& .pro-icon-wrapper": {
    backgroundColor: "transparent !important",
  },
  "& .pro-inner-item": {
    padding: "5px 35px 5px 20px !important",
  },
  "& .pro-inner-item:hover": {
    color: "pink !important",
  },
  "& .pro-menu-item.active": {
    color: "yellow !important",
  },
}}
>
<Sidebar collapsed={isCollapsed}
rootStyles={{
  [`.${sidebarClasses.container}`]: {
    backgroundColor: 'transparent',
  },
}}
backgroundColor='transparent'>
  <Menu iconShape="square"
menuItemStyles={{
  button: {
   

    "&:hover": {
      backgroundColor:colors.primary[400] + "!important", // Hover background color

    },
   
  },
}}
  >
    <MenuItem
     
//  rootStyles={{
//   "& .ps-menu-button": {
//     backgroundColor: "transparent", // Default background
//     color: "white",
//     transition: "background-color 0.3s ease",
//     "&:hover": {
//       backgroundColor: "#1976d2", // Hover background
//       color: "white",
//     },
//   },
// }}
    onClick={() => setIsCollapsed(!isCollapsed)}
    icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
  >

      <Box 
      alignItems={"center"}
      sx={{
        display:"flex",
      
      flexDirection:"row",
      Padding:20,
        width: 200,
        height: 100, // Default color
     
      }}>
    
      {!isCollapsed&&

    <MenuOutlinedIcon/>
}
  {!isCollapsed&&
  <img 
  style={{
    marginLeft:10
  }}
  alt='logo'
  width={'50%'}
  src={'../../assets/logo-en-lg.png'}/>}
  </Box>
  </MenuItem>

<Item
icon={<ForwardToInboxIcon/>}
isCollapsed={isCollapsed}
setIsCollapsed={setIsCollapsed}
selected={selected}
setSelected={setSelected}
title="Messages"
to="/"
/>


<Item
icon={<ShowChartIcon/>}
isCollapsed={isCollapsed}
setIsCollapsed={setIsCollapsed}
selected={selected}
setSelected={setSelected}
title="Analytics"
to="/analytics"
/>


<Item
icon={<SettingsIcon/>}
isCollapsed={isCollapsed}
setIsCollapsed={setIsCollapsed}
selected={selected}
setSelected={setSelected}
title="Settings"
to="/settings"
/>



      {/* <MenuItem onClick={() => setIsCollapsed(!isCollapsed)}>
      <Box
    style={{display:"flex",flexDirection:"row",marginLeft:"10px"}}>

<ShowChartIcon/>
{
  !isCollapsed&&
      <Typography style={{marginLeft:10}}>Analytics</Typography>}
      </Box>
      </MenuItem> 
      <MenuItem onClick={() => setIsCollapsed(!isCollapsed)}>
      <Box
    style={{display:"flex",flexDirection:"row",marginLeft:"10px"}}>

 
<SettingsIcon/>
{!isCollapsed&&
      <Typography style={{marginLeft:10}}>Settings</Typography>}
      </Box>
      </MenuItem>  */}


   
    
      </Menu>
      </Sidebar>
      </Box>
  )
}
