
import React, { memo, useEffect, useRef, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import * as yup from "yup"
import { Box, Button,TextField, useMediaQuery,CircularProgress, Typography} from '@mui/material'
import FormikSelect from '../../components/FormikSelect'
import { DateTimePicker} from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import openTypes from "./OpenLinkTypes.json"
import openLinkTypeRelatedFields from "./openLinkTypeRelatedFields.json"
import TestDeviceSelect from './TestDeviceSelect'
import moment from 'moment-timezone'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import textLengths from '../../fieldsTextlength.json'
import useAxiosPrivate from '../../hooks/useAxiosPrivate.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


dayjs.extend(utc);
dayjs.extend(timezone);
  const initialValues={
    notificationTitle:"",
    notificationText:"",
    notificationTitleArabic:"",
    notificationTextArabic:"",
    notificationName:"",
    selectedOS:[],
    selectedCountries:[],
    selectedLanguage:[],
    dateTime:null,
    openTypes:"",
    nidField:"",
    pageType:"",
    linkField:"",
    linkTypeField:"",
    selectedTimezone:""
  
  }
  
  // console.log("json "+JSON.stringify(openTypes))
  // console.log("parse "+JSON.parse(JSON.stringify(openTypes)))
  // const countriesOptions=[
  //   {value:"jo", label:"Jordan"},
  //   {value:"sa",label:"Saudi Arabia"}
  // ]
  const notificationSchema=yup.object().shape({
    notificationTitle: yup.string().when('selectedLanguage', {
      is:(value)=> value?.includes("en"), // If hasCategory is true
      then:()=> yup.string().required("required")
      .test("length-check", "Too long!", (titleValue) => {
        if (!titleValue) return true; // Skip validation if value is empty
        if (titleValue.length > 100) return false; // Too long (will trigger error)
        return true;
      })
      .test("length-check-acceptable",  (titleValue) => {
        if (!titleValue) return true; // Skip validation if value is empty
        if (titleValue.length > 30 && titleValue.length <= 40) return "Long but acceptable"; // Between 101-200 chars
        return true;
      }), // Make category required
      otherwise:()=> yup.string().notRequired(), // Otherwise, it's optional
    }),


    notificationTitleArabic: yup.string().when('selectedLanguage', {
      is:(value)=> value?.includes("ar"), // If hasCategory is true
      then:()=> yup.string().required("required")
      .test("length-check", "Too long!", (titleValue) => {
        if (!titleValue) return true; // Skip validation if value is empty
        if (titleValue.length > 100) return false; // Too long (will trigger error)
        return true;
      })
      .test("length-check-acceptable",  (titleValue) => {
        if (!titleValue) return true; // Skip validation if value is empty
        if (titleValue.length > 30 && titleValue.length <= 40) return "Long but acceptable"; // Between 101-200 chars
        return true;
      }), // Make category required
      otherwise:()=> yup.string().notRequired(), // Otherwise, it's optional
    }),

    notificationText: yup.string().when('selectedLanguage', {
      is:(value)=>value?.includes("en"), 
      then:()=> yup.string().required("required")
      .test("length-check", "Too long!", (textValue) => {
        if (!textValue) return true; // Skip validation if value is empty
        if (textValue.length > 1024) return false; // Too long (will trigger error)
        return true;
      })
      .test("length-check-acceptable", "Long but acceptable", (textValue) => {
        if (!textValue) return true; // Skip validation if value is empty
        if (textValue.length > 1 && textValue.length <= 100) return true; // Between 101-200 chars
        return true;
      }), otherwise:()=> yup.string().notRequired(), // Otherwise, it's optional
    }),

    notificationTextArabic: yup.string().when('selectedLanguage', {
      is:(value)=>value?.includes("ar"), 
      then:()=> yup.string().required("required")
      .test("length-check", "Too long!", (textValue) => {
        if (!textValue) return true; // Skip validation if value is empty
        if (textValue.length > 1024) return false; // Too long (will trigger error)
        return true;
      })
      .test("length-check-acceptable", "Long but acceptable", (textValue) => {
        if (!textValue) return true; // Skip validation if value is empty
        if (textValue.length > 1 && textValue.length <= 100) return true; // Between 101-200 chars
        return true;
      }), otherwise:()=> yup.string().notRequired(), // Otherwise, it's optional
    }),


    notificationName:yup.string().required("Please add the notification name"),
    selectedOS: yup.array().min(1,"Please Select OS"),
    selectedCountries: yup.array().min(1,"Please Select Country"),
    selectedLanguage:yup.array().min(1,"Please Select Language"),
    dateTime: yup.date()
    .typeError("Invalid date/time") // Prevents "undefined" errors
    .required("Date & Time is required") ,
 
    openTypes:yup.string().notRequired(),
    // .required("Please Select type"),
    selectedTimezone:yup.string().required("Please Select time zone"),
    
    nidField:yup.string()
    .when('openTypes', {
      is:(value)=>   {return openLinkTypeRelatedFields[value]?.some(field =>  (field?.value === "nid"&&field?.required===true))}, // If hasCategory is true
      then:()=> yup.string().required('nid is required'), // Make category required
      otherwise:()=> yup.string().notRequired(), // Otherwise, it's optional
    })
    ,
    pageType:yup.string()
    .when('openTypes', {
      is:(value)=>  { return openLinkTypeRelatedFields[value]?.some(field => (field?.value === "type"&&field?.required===true))}, // If hasCategory is true
      then:()=> yup.string().required('type is required'), // Make category required
      otherwise:()=> yup.string().notRequired(), // Otherwise, it's optional
    })
    ,
    linkField:yup.string()
    .when('openTypes', {
      is:(value)=>  { return openLinkTypeRelatedFields[value]?.some(field => (field?.value === "link"&&field?.required===true))}, // If hasCategory is true
      then:()=> yup.string().required('link is required'), // Make category required
      otherwise:()=> yup.string().notRequired(), // Otherwise, it's optional
    }),
    linkTypeField:yup.string()
    .when('openTypes', {
      is:(value)=>  { return openLinkTypeRelatedFields[value]?.some(field => (field?.value === "open_link_type"&&field?.required===true))}, // If hasCategory is true
      then:()=> yup.string().required('Open Link Type is required'), // Make category required
      otherwise:()=> yup.string().notRequired(), // Otherwise, it's optional
    }),
    
  })

function ComposeMessage() {

   const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // goes one step back
  };
  // return (<div>rijgr</div>)


const axiosPrivate = useAxiosPrivate();


 const [countriesOptions,setCountriesOptions]=useState([])
 const [languageOptions,setLanguageOptions]=useState([])
 const [osOptions,setOsOptions]=useState([])

 const [openType,setOpenType]=useState(null)
 const [showTestingDevicesChecklist,setShowTestingDevicesChecklist]=useState(false)
 const [testingDevicesList,setTestingDevicesList]=useState([])
 const [testingDevicesSelectedList,setTestingDevicesSelectedList]=useState([])

 const [loadingSend,setLoadingSend]=useState(false)
 const [loadingTest,setLoadingTest]= useState (false)
 const [loadingData,setLoadingData]= useState (false)
 const [errorText,setErrorText]=useState([])
//  const [timezone, setTimezone] = useState(null);
 const bottomButtonRef=useRef(null);
const isNonMobile=useMediaQuery("(min-width:600px)")



useEffect(() => {
  if (bottomButtonRef.current&&openType) {

    // Scroll to the bottom of the container when items change
    bottomButtonRef.current?.scrollIntoView({ behavior: "smooth" });
   
  }
}, [openType]); 


useEffect(()=>{


  const abortController = new AbortController();
  const request = async ()=>{
    setLoadingData(true)
  try{
 const countriesResponse=await axiosPrivate.get("api/devices/countries",
  {signal: abortController.signal})
 

//  await  fetch("http://localhost:4000/api/devices/countries",{
//   method: "GET", 
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${auth?.accessToken}`
//   }
// })
//  const countriesResponseJson=await countriesResponse.json()
 if (countriesResponse?.data?.length>0){
  setCountriesOptions( countriesResponse?.data?.map((val)=>(
    {
      value:val?.country,
      label:val?.country
    }))
  )
 }
 const languagesResponse=await axiosPrivate.get("api/devices/languages",
  {signal: abortController.signal}
 )
 
 
 
//  await  fetch("http://localhost:4000/api/devices/languages",{
//   method: "GET", 
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${auth?.accessToken}`
//   }
// })
//  const languagesResponseJson=await languagesResponse.json()
 if (languagesResponse?.data?.length>0){
  setLanguageOptions( languagesResponse?.data?.map((val)=>(
    {
      value:val?.language,
      label:val?.language
    }))
  )

 }
 const OSResponse=await axiosPrivate.get("api/devices/os",
  {signal: abortController.signal}
 )
 
 
//  await  fetch("http://localhost:4000/api/devices/os",{
//   method: "GET", 
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${auth?.accessToken}`
//   }
// })
//  const OSResponseJson=await OSResponse.json()
 if (OSResponse?.data?.length>0){
  setOsOptions( OSResponse?.data?.map((val)=>(
    {
      value:val?.device_type,
      label:val?.device_type
    }))
  )

  setLoadingData(false)

 }
}catch(error){
  console.log("error"+error)
}
}


  
 
 request()


 return ()=> abortController.abort(); // Cleanup function to abort the
},[])

const getTimeZonesArray=()=>{
  const timezones=moment.tz.names().map((timezone)=>{
  
    return{
   
value:timezone,
label:timezone
  }})
  return timezones
}

const openTestingDevicesCheckList=()=>setShowTestingDevicesChecklist(true)
const closeTestingDevicesChecklist=()=>setShowTestingDevicesChecklist(false)



const getNotificationParams=async(values)=>{
  const params = new URLSearchParams();
  params.set("campaign_name",values?.notificationName);
  params.set("campaign_id",values?.notificationName?.trim().toLowerCase().replace(/\s+/g, '_'))
  values?.openTypes&&params.set("open_type",values?.openTypes)
  values?.openTypes&&values?.nidField&&params.set("nid",values?.nidField)
  values?.openTypes&&values?.pageType&&params.set("page_type",values?.pageType)
  values?.openTypes&&values?.link&&params.set("link",values?.linkField)
  values?.openTypes&&values?.linkTypeField&&params.set("link_type",values?.linkTypeField)

  



    return params
}





const handleSendTest =async (values)=>{

  // const tokens=Object.keys(testingDevicesSelectedList)?.map (key=> {if(testingDevicesSelectedList[key])return key}  )
  const tokens = testingDevicesSelectedList;
  console.log("tokes that will be sent in test url "+JSON.stringify(testingDevicesSelectedList))
  if (tokens&&tokens?.length>0){
setLoadingTest(true)

  const params = await getNotificationParams(values)

// const url=new URL("api/notifications/test")


    console.log("tokens "+JSON.stringify(tokens))
    // const token="e7PwK8iUQ066C3jQRWF43M:APA91bHy_YHxDpxDo-8rYmP_7C1T_hYwJUpxik5GYy-4UssJtmWVHovbjjwBN9ugPluLL_u6Xu_aTaITPGy_t8ugLZJNCEjeyD03EomU13JlQ5tCCZ_-AM4"
 params.set("tokens", JSON.stringify(tokens))

    if (values?.selectedLanguage?.includes("en")&&values?.notificationTitle&&values?.notificationText){
      params.set("title",values?.notificationTitle)
      params.set("body",values?.notificationText)
    // url.search = params.toString();

// console.log("url send pn "+url)

await axiosPrivate.get("api/notifications/test",{params})

//  await fetch(url,{
//   method: "GET", 
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${auth?.accessToken}`
//   }
// })
setLoadingTest(false)
}

 if (values.selectedLanguage.includes("ar")&&values?.notificationTitleArabic&&values?.notificationTextArabic){
params.set("title",values.notificationTitleArabic)
params.set ("body",values.notificationTextArabic)
// url.search= params?.toString()
await axiosPrivate.get("api/notifications/test",{params})
setLoadingTest(false)

 }
}
}

const handleFormSubmit = async(values)=>{

// console.log("values in submit "+JSON.stringify(values))
// const tokens=Object.keys(testingDevicesSelectedList)?.map (key=>{if(testingDevicesSelectedList[key])return key}  );
const tokens = testingDevicesSelectedList;
  // if (
  //   values?.notificationTitle&&
  //   values.notificationText&&
  //   values.selectedOS&&
  //   values.selectedLanguage&&
  //   values.selectedCountries&&
  //   values.dateTime){
    const dateInTimezone = values.dateTime.tz(values.selectedTimezone.value, true);
  //   console.log("naive time "+naive)
  // const dateInTimezone = dayjs(naive).tz(values.selectedTimezone);
  const dateTimeFormatted= dateInTimezone.format();
    console.log('Submitted:', {
      ...values,
      dateInTimezone:dateInTimezone,
      dateTimeFormatted: dateTimeFormatted,
      dateTimeLocalized: dateInTimezone.format('LLLL'),
    });


console.log("open type in submit"+ values?.openTypes)
console.log("selected languages in submit "+values.selectedLanguage)
console.log("timezone in submit "+values?.selectedTimezone)
console.log("dateTime in submit "+dateTimeFormatted)
  // const inputDateTime = dayjs.tz(values?.dateTime, values?.selectedTimezone); 
  const now = dayjs(); // Get current time in local time zone
  // console.log("input date time with time zone "+inputDateTime)

   if (!dateInTimezone.isAfter(now)){
alert("the time is in the past ")
console.log("time date in submit "+values?.dateTime)
   }

   else
{
  // const url = new URL('api/notifications/send_pn');
const params =await getNotificationParams(values)
  params.set('tokens',JSON.stringify(tokens) );
  params.set('time',dateTimeFormatted);
  params.set('timezone',values?.selectedTimezone);
  
  params.set("os",JSON.stringify(values?.selectedOS));
  params.set("countries",JSON.stringify(values.selectedCountries))



const responses=[];

  if (values?.selectedLanguage?.includes("en"))
    {
    
      params.set("languages",["en"])
      params.set('title',values?.notificationTitle);
      params.set('body',values?.notificationText);
 setLoadingSend(true) 
 try{
      const sendResponse =await axiosPrivate.get("api/notifications/send_pn",{params})
      responses.push(sendResponse.data)
console.log("send response" +JSON.stringify(sendResponse.data))
 }
 catch(error){
   setErrorText("send English Notification failed: "+error.response?.data?.message || "An error occurred")
return;
 }
      // url.search = params.toString();

      // console.log("url send pn "+url)
      
      //  await axiosPrivate.get("api/notifications/send_pn",{params})
    }

    
    if (values?.selectedLanguage?.includes("ar"))
      {
       
        params.set('title',values?.notificationTitleArabic);
        params.set('body',values?.notificationTextArabic);
        params.set("languages",["ar"])
      
     setLoadingSend(true) 
     setErrorText(null)
     try{
      const sendResponse =await axiosPrivate.get("api/notifications/send_pn",{params})
      responses.push(sendResponse.data)
      
     }
     catch(error){
setErrorText("send Arabic Notification failed: "+error.response?.data?.message || "An error occurred")
return;
     }
    }
      
//         url.search = params.toString();

// console.log("url send pn "+url)

//  await fetch(url)

    
  



  handleGoBack() 
    toast.success('Scheduled successfully!')
  
 setLoadingSend(false)


}
}






    

  return (
    <Box m="20px">

<Formik
onSubmit={handleFormSubmit}
initialValues={initialValues}
validationSchema={notificationSchema}
handleChange={(e)=>console.log("handle change "+JSON.stringify(e))}
>
{({values,errors,touched,handleBlur,handleChange,handleSubmit,setFieldValue})=>{
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
         <FormikSelect
    loading={loadingData}
   name="selectedLanguage"
   label="Language"
   options={languageOptions}
    onBlur={handleBlur}
      onChange={handleChange}
      value={values.selectedLanguage}
   ></FormikSelect>
       <h1
    style={{gridColumn:"span 4"}}
    >Text</h1>
 {!!values?.selectedLanguage?.includes("ar")&&
<TextField
      fullWidth
      
      variant='filled'
      type='text'
      label= 'Arabic Title'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.notificationTitleArabic}
      name='notificationTitleArabic'
      error={!!touched.notificationTitleArabic && !!errors.notificationTitleArabic}
      // helperText={!!touched.notificationTitle&& !!errors.notificationTitle}
      sx={{gridColumn:"span 4"}}
      helperText={
        
  <span style={{ 
            color:
            !errors?.notificationTitleArabic&& values.notificationTitleArabic.length>0&&values.notificationTitleArabic.length<textLengths?.notificationTitle?.good?"green":
            (!errors?.notificationTitleArabic&&values.notificationTitleArabic.length>0&&values.notificationTitleArabic.length<textLengths?.notificationTitle?.acceptable?"orange"
              :"red") }}>
                {errors?.notificationTitleArabic??values?.notificationTitleArabic?.length+"/"+textLengths.notificationTitle.acceptable}
                </span>
      }
      ></TextField>}
      {!!values?.selectedLanguage?.includes("ar")&&
      <TextField
      fullWidth
      variant='filled'
      type='text'
      label= 'Arabic Text'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values?.notificationTextArabic}
      name='notificationTextArabic'
      error={!!touched?.notificationTextArabic && !!errors?.notificationTextArabic}
      helperText={
        
          <span style={{ color:!errors?.notificationTextArabic&&values.notificationTextArabic.length>0&& values.notificationTextArabic.length<textLengths.notificationText.good?"green":
          (!errors?.notificationTextArabic&&values.notificationTextArabic.length>0&&values.notificationTextArabic?.length<textLengths?.notificationText?.acceptable?"orange":
            "red") }}>
              {errors?.notificationTextArabic??values?.notificationTextArabic?.length+"/"+textLengths.notificationText.acceptable}
              </span>
    }

    sx={{
      gridColumn:"span 4"
    }}
      ></TextField>}


    {!!values?.selectedLanguage?.includes("en")&&
      <TextField 
      fullWidth
      variant='filled'
      type='text'
      label= 'English Title'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.notificationTitle}
      name='notificationTitle'
      error={!!touched.notificationTitle && !!errors.notificationTitle}
      // helperText={!!touched.notificationTitle&& !!errors.notificationTitle}
      sx={{gridColumn:"span 4"}}
      helperText={
        <span style={{ 
            color:
            !errors?.notificationTitle&& values.notificationTitle.length>0&&values.notificationTitle.length<textLengths.notificationTitle.good?"green":
            (!errors?.notificationTitle&&values.notificationTitle.length>0&&values.notificationTitle.length<textLengths.notificationTitle.acceptable?"orange"
              :"red") }}>
                {errors?.notificationTitle??values?.notificationTitle?.length+"/"+textLengths.notificationTitle.acceptable}
                </span>
      }
      ></TextField>}
       {!!values?.selectedLanguage?.includes("en")&&
         <TextField
      fullWidth
      variant='filled'
      type='text'
      label= 'English Text'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.notificationText}
      name='notificationText'
      error={!!touched.notificationText && !!errors.notificationText}
      helperText={
        
        <span style={{ color:!errors?.notificationText&&values.notificationText.length>0&& values.notificationText.length<textLengths.notificationText.good?"green":
          (!errors?.notificationText&&values.notificationText.length>0&&values.notificationText?.length<textLengths?.notificationText?.acceptable?"orange":
            "red") }}>
              {errors?.notificationText??values?.notificationText?.length+"/"+textLengths.notificationText.acceptable}
              </span>
    }
      sx={{gridColumn:"span 4"}}
      ></TextField>}




<TextField 
      fullWidth
      variant='filled'
      type='text'
      label= 'Campaign name'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.notificationName}
      name='notificationName'
      error={!!touched.notificationName && !!errors.notificationName}
      helperText={!!touched.notificationName && !!errors.notificationName}
      sx={{gridColumn:"span 4"}}
      ></TextField>

{(
  (values?.selectedLanguage?.length>0)
  &&
  (
  (
    !values?.selectedLanguage?.includes("en")
    ||
    (
      values?.selectedLanguage?.includes("en")
      &&values?.notificationTitle
      &&values.notificationText
    )
)
&&
  ( 
  !values?.selectedLanguage?.includes("ar")
  ||
  (
    values?.selectedLanguage?.includes("ar")
    &&!errors?.notificationTitleArabic
    &&!errors?.notificationTextArabic
  )
)
)
)
&&
loadingTest?<CircularProgress/>:
<Button
sx={{ boxShadow: "none", "&:hover": { boxShadow: "none" } ,width:200,background:"#7CACF8",color:"#203F72"}}
onClick={async(event)=>{
  event.preventDefault();
  // sedTestMessage()
  setLoadingTest(true)
  const response =await axiosPrivate.get("api/devices/test_devices")


 
  console.log("testing devices list "+JSON.stringify(response))
  const testingDevices=response?.data?.map((device)=>{
    console.log("device token in the list "+device)
    return device})
    console.log("testing devices "+JSON.stringify(testingDevices))
  setTestingDevicesList(testingDevices)
    
// showTestingDevicesChecklist()
setLoadingTest(false)
openTestingDevicesCheckList()
}}>Test</Button>


}
{showTestingDevicesChecklist&&<TestDeviceSelect
open={showTestingDevicesChecklist}
handleClose={closeTestingDevicesChecklist}
testingDevicesList={testingDevicesList}
checkedItems={testingDevicesSelectedList}
setCheckedItems={setTestingDevicesSelectedList}
handleSend={()=>handleSendTest(values)}
loadingTest={loadingTest}


></TestDeviceSelect> }
    <h1
    style={{gridColumn:"span 4"}}
    >Target</h1>
   

   <FormikSelect
   loading={loadingData}
   name="selectedOS"
   label="Operating System"
   options={osOptions}
   onBlur={handleBlur}
      onChange={handleChange}
      value={values.selectedOS}
   ></FormikSelect>




<FormikSelect
loading={loadingData}
    name="selectedCountries"
    label="Countries"
    options={countriesOptions}
    onBlur={handleBlur}
    onChange={handleChange}
    value={values.selectedCountries}
   ></FormikSelect>

<h1
    style={{gridColumn:"span 4"}}
    >Scheduling</h1>



<Box sx={{gridColumn:"span 2"}}>
<DateTimePicker
              name='dateTime'
              label="Select Date & Time"
              format="YYYY-MM-DD HH:mm:ss"
              value={values.dateTime}
                onChange={(newValue) => {
                  console.log("new value in datetime picker "+newValue)
                  
                  setFieldValue('dateTime', newValue)}}
            //   value={values.dateTime ? dayjs(values.dateTime) : null}
            //   // {values.dateTime ? dayjs(values.dateTime) : null} 
            //   onChange={(newValue) => {
            //     console.log("new value in datetime picker "+newValue)
            //     setFieldValue("dateTime", newValue ? dayjs(newValue).utc() : null);
                  
            //   }
            // }
              slotProps={{
                textField: {
                  fullWidth:true,
                  onBlur:handleBlur,
                  error: !!touched.dateTime && !!errors.dateTime,
                  helperText: !!touched.dateTime && errors.dateTime ,
                 
                },
              }}
            
            />
            </Box>
            <Box sx={{gridColumn:"span 2"}}>
            <FormikSelect
             multiple={false}
       name="selectedTimezone"
       label="Timezone"
      onChange={handleChange}
       options={getTimeZonesArray()}
       onBlur={handleBlur}
    value={values.selectedTimezone}
       ></FormikSelect>
            </Box>



<h1
    style={{gridColumn:"span 4"}}
    >Opening Options</h1>

<FormikSelect
   name="openTypes"
    multiple={false}
   label="Type"
  //  value={values.openTypes}
   options={openTypes}
   onBlur={handleBlur}
    onChange={handleChange}
    value={values.openTypes}
      // onChange={(e)=>{handleChange(e);setOpenType(values?.openTypes)}}
   ></FormikSelect>
   {!!values?.openTypes&& openLinkTypeRelatedFields[values?.openTypes]?.some(field => field.value === "type")&&
   <TextField
      fullWidth
      variant='filled'
      type='text'
      label= 'Page Type'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.pageType}
      name='pageType'
      error={!!touched.pageType && !!errors.pageType}
      helperText={!!touched.pageType&& !!errors.pageType}
      sx={{gridColumn:"span 4"}}
      ></TextField>}

{!!values?.openTypes&& openLinkTypeRelatedFields[values?.openTypes]?.some(field => field.value === "nid")&&
<TextField
      fullWidth
      variant='filled'
      type='text'
      label= 'node ID'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.nidField}
      name='nidField'
      error={!!touched.nidField && !!errors.nidField}
      helperText={!!touched.nidField&& !!errors.nidField}
      sx={{gridColumn:"span 4"}}
      ></TextField>}

{!!values?.openTypes&& openLinkTypeRelatedFields[values?.openTypes]?.some(field => field.value === "link")&&<TextField
      fullWidth
      variant='filled'
      type='text'
      label= 'Link URL'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.linkField}
      name='linkField'
      error={!!touched.linkField && !!errors.linkField}
      helperText={!!touched.linkField&& !!errors.linkField}
      sx={{gridColumn:"span 4"}}
      ></TextField>}

{!!values?.openTypes&& openLinkTypeRelatedFields[values?.openTypes]?.some(field => field.value === "open_link_type")&&
<TextField
      fullWidth
      variant='filled'
      type='text'
      label= 'Open Link Type'
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.linkTypeField}
      name='linkTypeField'
      error={!!touched.linkTypeField && !!errors.linkTypeField}
      helperText={!!touched.linkTypeField&& !!errors.linkTypeField}
      sx={{gridColumn:"span 4"}}
      ></TextField>}
      <Box sx={{gridColumn:"span 4"}}></Box>
 
       
   
    </Box>
   {loadingSend?<CircularProgress 
       color='grey'
       />:
       <Box sx={{display:"flex",alignItems:"center",gap:2}}>
       {errorText&& <Typography>
          {errorText}
           </Typography>}
    <Button 
      type="submit"
      variant="contained" 
      sx={{ boxShadow: "none", "&:hover": { boxShadow: "none" } ,marginBottom:10,width:200,background:"#7CACF8",color:"#203F72"}}
    ref={bottomButtonRef} >Submit</Button>
     </Box>
    }
   
  </Form>
)}}
</Formik>
  
    </Box>
  )
}


export default memo(ComposeMessage)