
import React, { Context, useContext } from 'react'
import { ColorModeContext, tokens } from '../theme';
import { Box, IconButton,useTheme } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LanguageIcon from '@mui/icons-material/Language';
import { LightModeOutlined } from '@mui/icons-material';
const Topbar = () => {
    const theme=useTheme();
    const colors= tokens(theme.palette.mode)
    const colorMode= useContext(ColorModeContext)
  return (
    
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box flex={1}></Box>
        <Box display="flex" justifyContent="space-between" p={2} alignSelf="flex-end"></Box>
        <IconButton onClick={colorMode.toggleColorMode}>
         {colorMode==="light"? <DarkModeOutlinedIcon/>:<LightModeOutlined/>}
        </IconButton>
        <IconButton>
          <LanguageIcon/>

          </IconButton>

    </Box>
  )
}

export default Topbar