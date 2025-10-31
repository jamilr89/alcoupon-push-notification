import { createContext,useState,useMemo } from "react";
import { createTheme} from "@mui/material";

export const tokens = mode =>({
    ...(mode=== 'dark'
    ?{
        background:"#121212",
        primary :{
          100: "#d3d3d3",
          200: "#a6a6a6",
          300: "#7a7a7a",
          400: "#4d4d4d",
          500: "#212121",
          600: "#1a1a1a",
          700: "#141414",
          800: "#0d0d0d",
          900: "#070707"
},
font: {
    100: "#efefef",
    200: "#dfdfdf",
    300: "#cfcfcf",
    400: "#bfbfbf",
    500: "#afafaf",
    600: "#8c8c8c",
    700: "#696969",
    800: "#464646",
    900: "#232323"
},

    }
    :{
        background:"#fcfcfc",
        font :{
            100: "#d3d3d3",
            200: "#a6a6a6",
            300: "#7a7a7a",
            400: "#4d4d4d",
            500: "#212121",
            600: "#1a1a1a",
            700: "#141414",
            800: "#0d0d0d",
            900: "#070707"
  },
  primary: {
    100: "#efefef",
    200: "#dfdfdf",
    300: "#cfcfcf",
    400: "#bfbfbf",
    500: "#afafaf",
    600: "#8c8c8c",
    700: "#696969",
    800: "#464646",
    900: "#232323"
},
    }
    )
})

export const themeSettings =mode=>{
    const colors = tokens(mode)
    return {
        palette :{
            mode:mode,
            
                primary:{
                    main : colors.primary[500],
                },
                secondary:{
                    main:colors.font[500],
                },
                background:{
                default:colors.background,
                }
            
        },
        typography:{
            fontFamily:["Source Sans 3","sans-serif"].join(","),
            fontSize:12,
            h1:{
                fontFamily:["Source Sans 3","sans-serif"].join(","),
                fontSize:40,
            },
            h2:{
                fontFamily:["Source Sans 3","sans-serif"].join(","),
                fontSize:32,
            },
            h3:{
                fontFamily:["Source Sans 3","sans-serif"].join(","),
                fontSize:24,
            },
            h4:{
                fontFamily:["Source Sans 3","sans-serif"].join(","),
                fontSize:20,
            },
            h5:{
                fontFamily:["Source Sans 3","sans-serif"].join(","),
                fontSize:16,
            },
            h6:{
                fontFamily:["Source Sans 3","sans-serif"].join(","),
                fontSize:14,
            },

        }

    }
}

//context for the color mode
export const ColorModeContext = createContext({
    toggleColorMode:()=>{

    }
})

export const useMode = () =>{
    const [mode ,setMode]=useState("dark");

    const colorMode = useMemo(
        () => ({
            toggleColorMode:() =>
                setMode((prev) => (prev === "light"?"dark":"light"))
        }),[]
    )
const theme = useMemo (()=> createTheme(themeSettings(mode)),[mode])

return [theme,colorMode]
}