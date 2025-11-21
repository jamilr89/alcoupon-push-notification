import { Box,Button,TextField, Typography,CircularProgress } from '@mui/material';
import { Formik,Form } from 'formik';
import { use, useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate.js';
import {useMediaQuery} from '@mui/material';
import FormikSelect from '../../components/FormikSelect.jsx';
import * as yup from "yup";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';





const CreateUserPage = () => {
  const blacklistedPasswords = [
  'password', 
  '123456', 
  'qwerty',
];

    const strongPasswordRegex = new RegExp(
  "^(?=.*[a-z])" +      // At least one lowercase letter
  "(?=.*[A-Z])" +      // At least one uppercase letter
  "(?=.*[0-9])" +      // At least one number
  "(?=.*[_!@#$%^&])" +  // At least one special character
  "(?=.{8,})"          // At least 8 characters long
);

   const navigate = useNavigate();

   const {id} = useParams();
 

  const handleGoBack = () => {
    navigate(-1); // goes one step back
  };
    
const isNonMobile=useMediaQuery("(min-width:600px)")
const axiosPrivate = useAxiosPrivate();

const [userRolesOptions, setUserRolesOptions] = useState([]);
const [loading,setLoading]=useState(false);
const [loadingDataFromApi,setLoadingDataFromApi]=useState(false);
const [error,setError]=useState("");
const [userData,setUserData]=useState({});

useEffect(() => {
  const controller = new AbortController();
      let isMounted = true;

       const getUserRolesOptionsRequest = async () => {
        try {

           const response = await axiosPrivate.get('api/users/user-roles-options', {
               signal: controller.signal
           });
           if (isMounted) {
           console.log('User roles:', JSON.stringify(response?.data));
           setUserRolesOptions(response?.data?.map((role) => ({
               value: role,
               label: (role?.replace(/([a-z])([A-Z])/g, '$1 $2') // 1. Adds the spaces: "user Role"
    .replace(/^./, str => str.toUpperCase()))})))
           }
        } catch (err) {

if (err.code === 'ERR_CANCELED') {
          console.log('Request cancelled by component cleanup (Strict Mode).');
          return; // Exit here. Do NOT set error state or re-throw.
        } 
        
        // Handle older Axios versions or general Fetch AbortError
        if (axiosPrivate.isCancel(err) || err.name === 'AbortError') {
             console.log('Request cancelled by component cleanup (Strict Mode).');
             return;
        }

        // Handle genuine API/Network errors
        if (isMounted) {
          // setError('API Error: ' + err.message);
          console.error('Actual API Error:', err);
        }
           console.error('Error fetching user roles:', err);
        }
       };
       
       getUserRolesOptionsRequest();

       return () => {
          isMounted = false;
           controller.abort();
       };

    }, []);

    useEffect(() => {
      if (id) {
       const fetchUserData = async () => {
          try {
            setLoadingDataFromApi(true);
            const response = await axiosPrivate.get(`/api/users/${id}`);
            const userData = response?.data;
            console.log('Fetched user data:', JSON.stringify(userData));
            setUserData(userData);
            
            // Populate form fields with fetched user data here
            // e.g., setFieldValue('username', userData.username);
          } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data. Please try again.');
          } finally {
            setLoadingDataFromApi(false);
          }
        };
        fetchUserData();
      }
    }, [id]);


const initialValues={
    username:userData?.username||"",
    password:"",
    passwordConfirmation:"",
    userRoles:(userData?.roles?.map((role) => 
                      {
                        return({
                      value: role,
                      label: (role?.replace(/([a-z])([A-Z])/g, '$1 $2') 
                              .replace(/^./, str => str.toUpperCase())
                            )})}))||[],
};

    

const userSchema= yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().when('.', {
  is: (idValue) => !id, 
  then: s => s.required("Password is required"), 
  otherwise: s => s.notRequired() 
}).matches(
      strongPasswordRegex,
      'Password must contain 8 characters, one uppercase, one lowercase, one number, and one special character (_!@#$%^&)'
    ).test(
    'not-blacklisted', // A unique name for the test
    'This password is too common and is not allowed.', // Error message
    function (value) {
     if (!value) return true; 

      // Convert the entered password to lowercase once for efficiency
      const lowerCaseValue = value.toLowerCase();

      // Check if ANY blacklisted word is included in the entered password
      const containsBlacklistedWord = blacklistedPasswords.some(word => 
        lowerCaseValue.includes(word)
      );

      // Validation succeeds if it DOES NOT contain a blacklisted word.
      return !containsBlacklistedWord;
    }
  ),
    passwordConfirmation: yup.string()
    .when('password', {
  is:passwordValue => (!id || passwordValue?.length>0),
  then: s => s.required("Please reinsert your password"),
  otherwise: s => s.notRequired()
}).oneOf([yup.ref('password'), null], 'Passwords must match'),
    userRoles: yup.array().min(1, "At least one role is required").required("Roles are required"),

});

const handleFormSubmit = async (values) => {
  setError("");
  setLoading(true);
  console.log("Form submitted with values:", values);
  const rolesArray = values?.userRoles?.map(roleObj => roleObj.value);
  //check if id exists for edit mode
  if (id) {
    try {
      const response = await axiosPrivate.put(`/api/users/${id}`, {
        username: values?.username,
        ...(values?.password?.length>0&&{password: values?.password}),
        roles: JSON.stringify(rolesArray),
      });
      console.log("Edit user response "+JSON.stringify(response))
      if (response?.status === 200)
      {handleGoBack();
      toast.success('User was updated successfully!')}
      
    } catch (err) {
      setError(err.response.data.error || "Failed to update user. Please try again.");
    }

  } else 
  {try {
  const response = await axiosPrivate.post('/auth/register', {
      username: values?.username,
        password: values?.password,
        roles: JSON.stringify(rolesArray),
    })
console.log("Create user response "+JSON.stringify(response))
    if (response?.status === 201)
      {handleGoBack();
      toast.success('User was added successfully!')}
     
    }catch(err){
      setError(err.response.data.error || "Failed to create user. Please try again.");
    }}

setLoading(false)
;
  }
if (loadingDataFromApi) {
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
   </Box>
  );
}

    return (
        <div>
                <Box m="20px">

<Formik
onSubmit={handleFormSubmit}
initialValues={initialValues}
validationSchema={userSchema}
enableReinitialize={true}
handleChange={(e)=>console.log("handle change "+JSON.stringify(e))}
>
{({values,errors,touched,handleBlur,handleChange,handleSubmit,setFieldValue})=>{
  // userData.username&&setFieldValue(userData?.username,false)
  console.log("values "+JSON.stringify(values))
   console.log("Errors "+JSON.stringify(errors))
   console.log("selected language "+JSON.stringify(values?.selectedLanguage))
  
  return(
  <Form 
   onSubmit={handleSubmit}
  >
    <Box display="grid" gap="30px" gridTemplateColumns="repeat(4,minmax(0,1fr))"
    marginBottom={20}
    sx={{
      "& > div":{gridColumn: isNonMobile ? undefined:"span 4"},
    }}>


         <TextField
      fullWidth
      variant='filled'
      type='text'
      label= 'Username'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.username}
      name='username'
      error={!!touched.username && !!errors.username}
      helperText={touched.username && errors.username}
    //   {

    //     // <span style={{ color:!errors?.username&&values.username.length>0&& values.username.length<textLengths.username.good?"green":
    //     //   (!errors?.username&&values.username.length>0&&values.username?.length<textLengths?.username?.acceptable?"orange":
    //     //     "red") }}>
    //     //       {errors?.notificationText??values?.notificationText?.length+"/"+textLengths.notificationText.acceptable}
    //     //       </span>
    // }
      sx={{gridColumn:"span 4"}}
      ></TextField>
      <TextField 
            fullWidth
            variant='filled'
            type='password'
            label= 'Password'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            name='password'
            error={!!touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            sx={{gridColumn:"span 4"}}
            ></TextField>
      <TextField 
            fullWidth
            variant='filled'
            type='password'
            label= 'Confirm Password'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.passwordConfirmation}
            name='passwordConfirmation'
            error={!!touched.passwordConfirmation && !!errors.passwordConfirmation}
            helperText={touched.passwordConfirmation && errors.passwordConfirmation}
            sx={{gridColumn:"span 4"}}
            ></TextField>


                 <FormikSelect
                   name="userRoles"
                   label="User Roles"
                   options={userRolesOptions}
                   onBlur={handleBlur}
                   onChange={handleChange}
                  value={values.userRoles}
                   error={!!touched.userRoles && !!errors.userRoles}
                   helperText={touched.userRoles && errors.userRoles}
                 ></FormikSelect>


               {error?.length>0&&
               <Typography
                  variant="h6" color="red"  sx={{ gridColumn: "span 4", mt: 2 }}  
               >
                {error}
                </Typography>}
                 <Button
                   type="submit"
                   color="primary"
                   variant="contained"
                   sx={{ gridColumn: "span 4" }}
                   disabled ={loading}
                 >
                   {loading ? (id? "Editing User..." : "Creating User...") : (id?"Edit User": "Create User")}
                 </Button>
               </Box>
             </Form>
           )}
}
</Formik>
</Box>
        </div>
    );
    // UI and form handling logic here
}


export default CreateUserPage;