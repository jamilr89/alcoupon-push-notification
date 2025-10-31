import {useEffect,useRef,useState} from 'react';
import {Box,Button,TextField,Typography,useMediaQuery,CircularProgress} from '@mui/material'
import { Formik,Form } from 'formik';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const LoginScreen = () => {
  const axiosPrivate = useAxiosPrivate();
    const usernameRef=useRef();
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const isNonMobile=useMediaQuery("(min-width:600px)")
    const [errorText,setErrorText]=useState('')
    const [loading,setLoading]=useState(false)
    const errorTypographyRef=useRef();
    useEffect(() => {
        usernameRef.current.focus();
      }, []);



    const handleSubmit = async (values) => {
        console.log("form values "+JSON.stringify(values))
const { username, password } = values;
try{
setLoading(true);
const loginResult=await axiosPrivate.post('/auth/login',
    JSON.stringify({ username, password }))



// const response = await fetch(`http://localhost:4000/auth/login?username=${username}&password=${password}`, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'withCredentials': 'true'
//   },
//   body: JSON.stringify({ username, password }),
// });
 const data = loginResult.data;
console.log("login response "+JSON.stringify(loginResult))
if (loginResult.status === 200) {
    const accessToken = data?.token;
    const roles = data?.roles;
    setAuth({ user: username, roles, accessToken });
    navigate(from, { replace: true });
    console.log("logged in" +JSON.stringify(auth))
} else {
    console.log("login failed")
}
}catch (error) {
    if (!error?.response) {
        setErrorText('No Server Response');
    } else if (error.response?.status === 400) {
        setErrorText('Missing Username or Password');
    } else if (error.response?.status === 401) {
        setErrorText('Unauthorized');
    } else {
        setErrorText('Login Failed');

    }

error&&    errorTypographyRef?.current?.focus();
}
finally{
    setLoading(false);
}
    }

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
        <Box
        height={"100%"}
         display={"flex"}
         alignContent={"center"}
         justifyContent={"center"}
         flexDirection={"row"} 
        //  mx={{background:"blue"}}
         >


   

    <Formik
    initialValues={{ username: '', password: '' }}
    validate={values => {
        const errors = {};
        if (!values.username) {
          errors.username = 'Required';
        }
        if (!values.password) {
          errors.password = 'Required';
        }
        return errors;
    }}
    onSubmit={handleSubmit}>

       { ({values,errors,touched,handleBlur,handleChange,handleSubmit,setFieldValue})=>{

         return (
        <Form>

              <Box  padding={2}
//   mx={{background:"red", }}
height={"100%"}
display={"flex"}
flexDirection={isNonMobile?"row":"column"}
    maxWidth={isNonMobile ? "600px" : "93%"}
    alignContent={"center"}
         justifyContent={"center"}
              >

                <Box
                alignContent={"center"}
                margin={2}
                >
                 <img 
  style={{
    width:200,
     objectFit: 'contain',
  
  }}
  alt='logo'
//   width={'50%'}
  src={'../../assets/logo-en-lg.png'}/>
  <Typography
    variant='h3'
  >
    Notification System
  </Typography>
  <Typography
  
  >
    Login
  </Typography>

  </Box>
  <Box
//   mx ={{background:"yellow"}}
  justifyContent={"center"}
  alignContent={"center"}
  margin={2}
  
  >
<TextField
 fullWidth
ref={usernameRef}
value={values.username}
name="username"
label="Username"
onChange={handleChange}
margin="normal"
error={!!touched.username && !!errors.username}
helperText={touched.username && errors.username}
></TextField>
<TextField
value={values.password}
type='password'
name="password"
label="Password"
onChange={handleChange}
 fullWidth
margin="normal"
error={!!touched.password && !!errors.password}
helperText={touched.password && errors.password}
></TextField>

<Typography 
color='red'
ref={errorTypographyRef}

>
    {errorText}
    </Typography>

<Button
style={{marginTop: "1rem"}}
type="submit"
variant="contained"
color="primary"
 fullWidth
>
    Login
</Button>
</Box>
</Box>
        </Form>
        
    )
       }}
   

    </Formik>
  
    </Box>)}

    export default LoginScreen;