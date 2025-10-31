import { Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Box,CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useAxiosPrivate from '../../hooks/useAxiosPrivate.js';


function Campaigns() {
  const [campaigns,setCampaigns]=useState([])
  const [loading,setLoading]=useState(true)
  const navigate = useNavigate();
  const {auth}=useAuth();
  const axiosPrivate=useAxiosPrivate()

useEffect(()=>{
let isMounted=true;
const abortController = new AbortController();
setLoading(true);

  const getCampaigns=async()=>{

    try{
   const campaignsResult= await  axiosPrivate.get("api/notifications/",{
    signal:abortController.signal
   });
    isMounted && setCampaigns(campaignsResult?.data)
  }catch(err){
    if(err.name==="AbortError"){
      console.log("fetch aborted")}
    }
   
//    ,{
//   method: "GET", 
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${auth?.accessToken}`
//   }
// })

  //  const campaignJSON= await campaignsResult.json();
  //  console.log("campaigns result "+JSON.stringify(campaignJSON))
   setLoading(false);

  }
  
getCampaigns()

return ()=>{
  isMounted=false;
  abortController.abort();
}
},[])

if (loading) 
    return (
<Box
display="flex"
height={"100%"}
flex={1}
justifyContent="center"
alignItems={"center"}
>

    <CircularProgress 
    color='grey'
    />
</Box>)


  return (
    <div>
<div style={{display:'flex',flexDirection:"row",justifyContent:"end",width:"100%"}}>
<Button  
variant="outlined" onClick={()=> navigate('/compose')} 
sx=
{{
  display:"flex",
  height:50,
  width:50,
  alignItems:"center",
  justifyContent:"center",
  m:2,
  color: 'text.primary', // Same as <h1>
  borderColor: 'text.primary', // Border matches <h1>
  '& .MuiSvgIcon-root': {
    color: 'inherit', // Icon inherits text color
  },
  '&:hover': {
    borderColor: 'text.secondary', // Optional: Slightly lighter/darker on hover
  },
}}
  
>
<AddIcon 
    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',width:"100%",backgroundColor:"transparent",fontSize:70
     }}
    ></AddIcon>
</Button>
</div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow


            sx={{
              borderTop: "1px solid #ccc",
              borderBottom: "1px solid #ccc",
            }}
          >
            <TableCell>Campaign Name</TableCell>
            <TableCell>Campaign</TableCell>
            <TableCell>Schedule</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Node</TableCell>
            <TableCell>Type</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns?.map((item,index) => (
            <TableRow
              key={index}
              sx={{
                borderTop: "1px solid #eee",
                borderBottom: "1px solid #eee",
              }}
            >




              <TableCell>{item?.campaign_name}</TableCell>
              <TableCell>
                <h3 style={{ width: '200px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.title}</h3>
                <p style={{ width: '200px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                  {item?.text}
                  </p>
                  </TableCell>
              <TableCell
              style={{ width: '100px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{(new Date(item?.time))?.toLocaleString()} ({item?.timezone})
              </TableCell>
              <TableCell
              style={{ width: '100px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{item?.status} 
              </TableCell>
              <TableCell
              style={{ width: '100px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{item?.nid} 
              </TableCell>
              <TableCell
              style={{ width: '100px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{item?.open_type} 
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
  
}

export default Campaigns