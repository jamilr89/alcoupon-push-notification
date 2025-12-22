import React, { use, useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts';
import {  Form, Formik } from 'formik'
import FormikSelect from '../../components/FormikSelect.jsx';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery ,CircularProgress} from '@mui/material'
 
 import useAuth from '../../hooks/useAuth.js';
import useAxiosPrivate from '../../hooks/useAxiosPrivate.js';
const initialValues={
   selectNotification: [],
   selectLanguage: []
 }

const AnalyticsScreen=()=>{

  const axiosPrivate=useAxiosPrivate();


const [languageChartData,setLanguageChartData]=useState()
const [platformChartData,setPlatformChartData]=useState()
const [countryChartData,setCountryChartData]=useState()
const [tableAnalyticsData,setTableAnalyticsData]=useState()
const [notificationList,setNotificationList]=useState([])
 const [countriesOptions,setCountriesOptions]=useState([])
 const [languageOptions,setLanguageOptions]=useState([])
 const [selectedCountries,setSelectedCountries]=useState([])
 const [selectedLanguages,setSelectedLanguages]=useState([])
 const [selectedOS,setSelectedOS]=useState([])
 const [osOptions,setOsOptions]=useState([])
const [selectedNotifications,setSelectedNotifications]=useState([])
const [loading,setLoading]=useState(false)
const [loadingTable,setLoadingTable]=useState(false)
const isNonMobile=useMediaQuery("(min-width:600px)")
const {auth}=useAuth();

useEffect(()=>{

const abortController = new AbortController();

  let isMounted=true;

setLoading(true);


   
  const request = async ()=>{


 try{
   const countriesResponse= await  axiosPrivate.get("api/devices/countries",{
    signal:abortController.signal

   
   });
    isMounted && setCountriesOptions(countriesResponse?.data?.map((val)=>(
    {
      value:val?.country,
      label:val?.country
    })))
  }catch(err){
    if(err.name==="AbortError"){
      console.log("fetch aborted")}
    }


 try{
   const languageResponse= await  axiosPrivate.get("api/devices/languages",{
    signal:abortController.signal

   
   });
    isMounted && setLanguageOptions(languageResponse?.data?.map((val)=>(
    {
      value:val?.language,
      label:val?.language
    })))
  }catch(err){
    if(err.name==="AbortError"){
      console.log("fetch aborted")}
    }



  

  try{
 const OSResponse= await axiosPrivate.get("api/devices/os",{
  signal:abortController.signal
 })
 
 isMounted&& setOsOptions(OSResponse?.data?.map((val)=>(
    {
      value:val?.device_type,
      label:val?.device_type
    })))
}catch(error){
  console.log("error"+error)
}


try{
const notificationsListResponse= await axiosPrivate.get("api/notifications",{
  signal:abortController.signal
})

isMounted&&setNotificationList(notificationsListResponse?.data?.map(notification=>(
   
{ value: notification?._id, label: notification?.campaign_name })))

}catch(error){
  console.log("error"+error)
}


  setLoading(false);
  }
 request()

 return ()=>{

  isMounted=false;
  abortController.abort();
}
 
},[])



useEffect(()=>{

const abortController = new AbortController();
  setLoadingTable(true);
    console.log("selectedNotifications changed "+JSON.stringify(selectedNotifications))
    console.log("selectedCountries changed "+JSON.stringify(selectedCountries))
    console.log("selectedLanguages changed "+JSON.stringify(selectedLanguages))
    console.log("selectedOS changed "+JSON.stringify(selectedOS)) 
    const getData= async()=>{


const getAnalyticsResponse = await axiosPrivate.get("api/notifications/get_analytics",{
  signal:abortController.signal,
  params: {
    'notification_ids':JSON.stringify(selectedNotifications?.map(item=>item?.value)),
    ...(selectedCountries?.length>0 && { countries: JSON.stringify(selectedCountries?.map(item=>item?.value)) }),
    ...(selectedLanguages?.length>0 && { languages: JSON.stringify(selectedLanguages?.map(item=>item?.value)) }),
    ...(selectedOS?.length>0 && { os: JSON.stringify(selectedOS?.map(item=>item?.value)) }),
    // ...(selectedNotifications?.length>0 && { notification_ids: JSON.stringify(selectedNotifications?.map(item=>item?.value)) }),
  }
}
    )

console.log("getAnalyticsResponse "+JSON.stringify(getAnalyticsResponse))
// isMounted&&setNotificationList(notificationsListResponse?.data?.map(notification=>(
const responseJSONRows=getAnalyticsResponse?.data?.data
    console.log("responseJSONRows "+JSON.stringify(responseJSONRows))
    const pieChartData=responseJSONRows?.languageStats?.map(data=>{
        console.log("data in map "+JSON.stringify(data))
        return  { id: data?._id, value: data?.count, label: data?._id }

    })


    console.log("pieChartData "+JSON.stringify(pieChartData))
     setLanguageChartData(pieChartData)




       const platformPieChartData=responseJSONRows?.platformStats?.map(data=>{
        console.log("data in map "+JSON.stringify(data))
        return  { id: data?._id, value: data?.count, label: data?._id }

    })


    console.log("pieChartData "+JSON.stringify(platformPieChartData))
     setPlatformChartData(platformPieChartData)




            const countryPieChartData=responseJSONRows?.countryStats?.map(data=>{
        console.log("data in map "+JSON.stringify(data))
        return  { id: data?._id, value: data?.count, label: data?._id }

    })


    console.log("pieChartData "+JSON.stringify(countryPieChartData))
     setCountryChartData(countryPieChartData)



             const tableAnalyticsData=responseJSONRows?.tableAnalytics
    //          .map(data=>{
    //     console.log("data in map "+JSON.stringify(data))
    //     return  { id: data?._id, value: data?.count, label: data?._id }

    // })


    console.log("pieChartData "+JSON.stringify(tableAnalyticsData))
     setTableAnalyticsData(tableAnalyticsData)
setLoadingTable(false);



















//         console.log("get data in analytics")
//         const dimensions=["language"]
//         const url=new URL(`http://localhost:4000/api/notifications/get_analytics`)
//         // ?notification_id=5555555&dimensions=${JSON.stringify(dimensions)}`
//         console.log ("selected notifications value array "+JSON.stringify(selectedNotifications?.map(item=>item?.value)))
//         url.searchParams.set('notification_ids',JSON.stringify(selectedNotifications?.map(item=>item?.value)))
//          selectedCountries?.length>0 && url.searchParams.set('countries',JSON.stringify(selectedCountries?.map(item=>item?.value)))
//         selectedLanguages?.length>0 && url.searchParams.set('languages',JSON.stringify(selectedLanguages?.map(item=>item?.value)))
//          selectedOS?.length>0 && url.searchParams.set('os',JSON.stringify(selectedOS?.map(item=>item?.value)))
//         // url.searchParams.set('dimensions',JSON.stringify(dimensions))
//     console.log("url "+url)
//         const response= await fetch(url,{
//   method: "GET", 
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${auth?.accessToken}`
//   }
// })
//     const responseJSON=await response.json()
//     const responseJSONRows=responseJSON?.data
//     console.log("responseJSONRows "+JSON.stringify(responseJSONRows))
//     const pieChartData=responseJSONRows?.languageStats?.map(data=>{
//         console.log("data in map "+JSON.stringify(data))
//         return  { id: data?._id, value: data?.count, label: data?._id }

//     })


//     console.log("pieChartData "+JSON.stringify(pieChartData))
//      setLanguageChartData(pieChartData)




//        const platformPieChartData=responseJSONRows?.platformStats?.map(data=>{
//         console.log("data in map "+JSON.stringify(data))
//         return  { id: data?._id, value: data?.count, label: data?._id }

//     })


//     console.log("pieChartData "+JSON.stringify(platformPieChartData))
//      setPlatformChartData(platformPieChartData)




//             const countryPieChartData=responseJSONRows?.countryStats?.map(data=>{
//         console.log("data in map "+JSON.stringify(data))
//         return  { id: data?._id, value: data?.count, label: data?._id }

//     })


//     console.log("pieChartData "+JSON.stringify(countryPieChartData))
//      setCountryChartData(countryPieChartData)



//              const tableAnalyticsData=responseJSONRows?.tableAnalytics
//     //          .map(data=>{
//     //     console.log("data in map "+JSON.stringify(data))
//     //     return  { id: data?._id, value: data?.count, label: data?._id }

//     // })


//     console.log("pieChartData "+JSON.stringify(tableAnalyticsData))
//      setTableAnalyticsData(tableAnalyticsData)
    }
    getData()

    return ()=>{
      abortController.abort();
    }
},[selectedNotifications,selectedCountries,selectedLanguages,selectedOS])



// useEffect(()=>{
    
//     const getData= async()=>{
//         console.log("get data in analytics")
//         const dimensions=["platform"]
//         const url=new URL(`http://localhost:4000/api/notifications/get_analytics`)
//         // ?notification_id=5555555&dimensions=${JSON.stringify(dimensions)}`
//         url.searchParams.set('notification_id',5555555)
//         url.searchParams.set('dimensions',JSON.stringify(dimensions))
//     console.log("url "+url)
//         const response= await fetch(url)
//     const responseJSON=await response.json()
//     const responseJSONRows=responseJSON?.data?.rows
//     console.log("responseJSONRows "+JSON.stringify(responseJSONRows))
//     const pieChartData=responseJSONRows.map(data=>{
//         console.log("data in map "+JSON.stringify(data))
//         if(data.metricValues[0]?.value>10) return  { id: data?.dimensionValues[0]?.value, value: data.metricValues[0]?.value, label: data?.dimensionValues[0]?.value }

//     })


//     console.log("pieChartData "+JSON.stringify(pieChartData))
//      setPlatformChartData(pieChartData)
//     }
//     getData()
// },[])

if (loading) 
    return (
<Box
display="flex"
height={"100%"}
justifyContent="center"
alignItems={"center"}
>

    <CircularProgress 
    color='grey'
    />
</Box>)

    return (
    <div style={{margin:"20px"}}>
<div m="20px" >
<Formik
// onSubmit={handleFormSubmit}
initialValues={initialValues}
// validationSchema={notificationSchema}
// handleChange={(e)=>console.log("handle change "+JSON.stringify(e))}
>
{({values,errors,touched,handleBlur,handleChange,handleSubmit,setFieldValue})=>{
  // console.log("values "+JSON.stringify(values))
  //  console.log("Errors "+JSON.stringify(errors))

  setSelectedNotifications((val)=>JSON.stringify(val)!==JSON.stringify(values?.selectNotification) ? values?.selectNotification : val)
  setSelectedCountries((val)=>JSON.stringify(val)!==JSON.stringify(values?.selectedCountries) ? values?.selectedCountries : val)
  setSelectedLanguages((val)=>JSON.stringify(val)!==JSON.stringify(values?.selectedLanguages) ? values?.selectedLanguages : val)
  setSelectedOS((val)=>JSON.stringify(val)!==(values?.selectedOS) ? values?.selectedOS : val)
  
  
 return (
 
 <Form 
   onSubmit={handleSubmit}
  >
    <Box display="grid" gap="30px" gridTemplateColumns="repeat(4,minmax(0,1fr))"
    // marginBottom={10}
    sx={{
      "& > div":{gridColumn: isNonMobile ? undefined:"span 4"},
    }}
    >
    
    <FormikSelect
   name="selectNotification"
   label="Campaign"
   options={notificationList}
   onBlur={handleBlur}
      onChange={handleChange}
      value={values.selectNotification}>
</FormikSelect>
     <FormikSelect
     name="selectedOS"
     label="Operating System"
     options={osOptions}
     onBlur={handleBlur}
        onChange={handleChange}
        value={values.selectedOS}
     ></FormikSelect>

        <FormikSelect
        name="selectedLanguages"
        label="Language"
        options={languageOptions}
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.selectedLanguages}
        ></FormikSelect>
         <FormikSelect
        name="selectedCountries"
        label="Countries"
        options={countriesOptions}
        onBlur={handleBlur}
           onChange={handleChange}
           value={values.selectedCountries}
        ></FormikSelect>
   </Box>
   </Form>

  
  )}
   }
 </Formik>
 </div>

  {loadingTable?(
<div
display="flex"
height={"100%"}
justifyContent="center"
alignItems={"center"}
>

    <CircularProgress 
    color='grey'
    />
</div>):
   <div>
      <Box display="grid" gap="30px" gridTemplateColumns="repeat(3,minmax(0,1fr))"
    // marginBottom={10}
    sx={{paddingBottom:3,
      "& > div":{gridColumn: isNonMobile ? undefined:"span 3",
        minWidth: 0, 
        maxHeight: 250,
        marginTop:2,
      // Manages overflow for text content
      overflowWrap: 'break-word',
      // Optional: Manages general overflow
      // overflowX: 'hidden',
      // height: isNonMobile ?'300px' : 'auto',
      },
    }}
    >
        {/* {JSON.stringify(languageChartData)} */}

   {languageChartData&&<PieChart
   colors={['#f10096', '#f48fb1', '#00b6cb']} 
   
      series={[
        {
          data:languageChartData,
       
          
        },
      ]}
      
      sx={{gridColumn:"span 1",maxHeight:200}}
    />}

    {platformChartData&&<PieChart
     colors={['#9e67ab', '#00b6cb', '#f10096']} 
      series={[
        {
          data:platformChartData
          
        },
      ]}
     sx={{gridColumn:"span 1",maxHeight:200}}
    />}

       {countryChartData&&<PieChart
      series={[
        {
          data:countryChartData
          
        },
      ]}
     sx={{gridColumn:"span 1",maxHeight:200}}
    />}
    </Box>

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
            <TableCell>Time</TableCell>
            <TableCell>Platform</TableCell>
            <TableCell>Language</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Count</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {tableAnalyticsData?.map((item)=>(
                <TableRow>
                  <TableCell>{item?.notificationName}</TableCell>
                  <TableCell>{item?.notificationTime ? `${new Date(item?.notificationTime).toLocaleString()} ${item?.notificationTimezone}` : 'N/A'}</TableCell>
                  <TableCell>{item?.platform}</TableCell>
                  <TableCell>{item?.language}</TableCell>
                  <TableCell>{item?.country}</TableCell>  
                  <TableCell>{item?.count}</TableCell>  
                </TableRow>
              ))}
            </TableBody>
            </Table>
            </TableContainer>
            </div>}
    </div>)
}

export default AnalyticsScreen;