import mysql from 'mysql2'
console.log("MYSQL_HOST_DEVICES_LIST "+process.env.MYSQL_HOST_DEVICES_LIST)
console.log("MYSQL_PORT_DEVICES_LIST "+process.env.MYSQL_PORT_DEVICES_LIST)
console.log("MYSQL_USER_DEVICES_LIST "+process.env.MYSQL_USER_DEVICES_LIST)
console.log("MYSQL_PASSWORD_DEVICES_LIST "+process.env.MYSQL_PASSWORD_DEVICES_LIST)
console.log("MYSQL_DATABASE_DEVICES_LIST "+process.env.MYSQL_DATABASE_DEVICES_LIST)

const pool= mysql.createPool({
    // host: process.env.MYSQL_HOST_DEVICES_LIST,
    // port:process.env.MYSQL_PORT_DEVICES_LIST,
    user:process.env.MYSQL_USER_DEVICES_LIST,
    password:process.env.MYSQL_PASSWORD_DEVICES_LIST,
    database:process.env.MYSQL_DATABASE_DEVICES_LIST, 
}).promise()
// console.log("pool "+JSON.stringify(pool))



export const getDevicesTokens=async(country,language,platform)=>{
    // AND os_version = "${conversionOSVersion}"
   
const query=`
SELECT gcm_code
FROM fs_30_mobile_device
WHERE country = "${country}" AND language = "${language}" AND device_type = "${platform}" ;`
console.log("query "+query)
const [rows]=await pool.query(query)
console.log("devices list "+JSON.stringify(rows))
return rows

}

export const getCountriesOptions=async ()=>{
   const query= `SELECT DISTINCT country
   FROM fs_30_mobile_device;`
   const [options] = await pool.query(query)
   console.log("devices list "+JSON.stringify(options))
   return options
}
export const getLanguagesOptions=async ()=>{
    const query= `SELECT DISTINCT language
    FROM fs_30_mobile_device;`
    const [options] = await pool.query(query)
    console.log("devices list "+JSON.stringify(options))
    return options
 }

 export const getOSOptions=async ()=>{
    const query= `SELECT device_type, COUNT(*) as count 
    FROM fs_30_mobile_device
    GROUP BY device_type;`
    const [options] = await pool.query(query)
    console.log("devices list "+JSON.stringify(options))
    return options
 }

 export const getDeviceData=async (token)=>{
    const query= `SELECT *
    FROM fs_30_mobile_device
    Where gcm_code ="${token}"`
    const [rows]= await pool.query(query)
     console.log("devices data "+JSON.stringify(rows))
    return rows
 }