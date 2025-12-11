import { Box,CircularProgress,Button,TableContainer,Table,TableHead,TableCell,TableBody,TableRow,Paper } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {  useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

function Users() {
    const axiosPrivate=useAxiosPrivate();
    const [users,setUsers]=useState([]);
    const [loading,setLoading]=useState(true);  
    const navigate=useNavigate();

useEffect(()=>{
//fetch users from backend api
const controller=new AbortController();
const fetchUSers=async()=>{
    setLoading(true);
    try {
        const response= await axiosPrivate.get('/api/users/');
        setUsers(response?.data);
        console.log("response from users request "+JSON.stringify(response?.data))
    }

catch(err){
    console.error(err);
}
finally {
    setLoading(false);
}

}
fetchUSers();

return () => {
    controller.abort();
};
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
    <div style={{margin:"20px"}}>
<div style={{display:'flex',flexDirection:"row",justifyContent:"end",width:"100%"}}>
<Button  
variant="outlined" onClick={()=> navigate('/users/create-user')} 
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
            <TableCell>Username</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Update Date</TableCell>
            <TableCell>Actions</TableCell>
        
            
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((item,index) => (
            <TableRow
              key={index}
              sx={{
                borderTop: "1px solid #eee",
                borderBottom: "1px solid #eee",
              }}
            >




              <TableCell>{item?.username}</TableCell>
               <TableCell>{item?.roles?.join(", ")}</TableCell>
                <TableCell style={{ width: '100px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{(new Date(item?.createdAt))?.toLocaleString()} </TableCell>
                 <TableCell style={{ width: '100px', whiteSpace: 'normal', wordWrap: 'break-word' }}>{(new Date(item?.updatedAt))?.toLocaleString()}</TableCell>
              <TableCell>
                <Button 
                  variant="outlined"
                  color="text.primary"
                  size="small"
                  onClick={() => navigate(`/users/edit-user/${item?._id}`)}
                >
                  Edit
                </Button>
              </TableCell>
</TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }


export default Users;
