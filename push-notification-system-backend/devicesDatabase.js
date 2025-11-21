import mysql from 'mysql2'
console.log("MYSQL_HOST_DEVICES_LIST "+process.env.MYSQL_HOST_DEVICES_LIST)
console.log("MYSQL_PORT_DEVICES_LIST "+process.env.MYSQL_PORT_DEVICES_LIST)
console.log("MYSQL_USER_DEVICES_LIST "+process.env.MYSQL_USER_DEVICES_LIST)
console.log("MYSQL_PASSWORD_DEVICES_LIST "+process.env.MYSQL_PASSWORD_DEVICES_LIST)
console.log("MYSQL_DATABASE_DEVICES_LIST "+process.env.MYSQL_DATABASE_DEVICES_LIST)
let basePool;
let pool;
try{
basePool= mysql.createPool({
    host: process.env.MYSQL_HOST_DEVICES_LIST,
    port:process.env.MYSQL_PORT_DEVICES_LIST,
    user:process.env.MYSQL_USER_DEVICES_LIST,
    password:process.env.MYSQL_PASSWORD_DEVICES_LIST,
    database:process.env.MYSQL_DATABASE_DEVICES_LIST, 
})



//  console.log("pool "+JSON.stringify(pool))
basePool.on('error', (err) => {
    // Check if the error is a connection-related or fatal error
    if (err.code === 'ETIMEDOUT' || err.fatal) {
        console.error('FATAL ASYNCHRONOUS POOL ERROR DETECTED! Service is **surviving** the crash attempt.');
        console.error('Connection to MySQL is lost or timed out. Application is operating in a degraded state.', err);
        
        // **IMPORTANT:** Do NOT re-throw the error or call process.exit() here.
        // You can set a global flag here (e.g., `dbStatus = 'down'`) 
        // that your query functions can check before attempting a connection.
        
    } else {
        console.warn('MySQL Pool Warning (Non-fatal):', err);
    }
});
 pool = basePool;

pool?.getConnection((err, connection) => {
    if (err) {
        console.error("Error getting MySQL connection:", err);
        return;
    }
    console.log("MySQL connection established");
    connection.release();
});

}catch (error){

    console.log("error in connection to database "+error)
}


function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
        // Use the standard pool.query with a callback
        pool.query(sql, values, (error, results, fields) => {
            if (error) {
                // Reject the promise on any error (network, query, etc.)
                return reject(error);
            }
            // Resolve with the results and fields array
            resolve([results, fields]); 
        });
    });
}
export const getDevicesTokens=async(country,language,platform)=>{
    // AND os_version = "${conversionOSVersion}"
   
const query=`
SELECT gcm_code
FROM fs_30_mobile_device
WHERE country = "${country}" AND language = "${language}" AND device_type = "${platform}" ;`
console.log("query "+query)
const [rows]=await queryAsync(query) //pool?.query(query)
console.log("devices list "+JSON.stringify(rows))
return rows
}
                  

export const getCountriesOptions=async ()=>{
    try {
    // console.log("pool is not null " + JSON.stringify(pool)  )
   const query= `SELECT DISTINCT country
   FROM fs_30_mobile_device;`
  
   const [options] = await queryAsync(query)??[]
   options && console.log("devices list "+JSON.stringify(options))
   return options
    }catch (error) {
        console.log("error in get countries options "+error)
    }
   
}
export const getLanguagesOptions=async ()=>{
    try {
    const query= `SELECT DISTINCT language
    FROM fs_30_mobile_device;`
    const [options] = await queryAsync(query)??[]
    console.log("devices list "+JSON.stringify(options))
    return options
    }catch (error) {
        console.log("error in get languages options "+error)
    }
 }

 export const getOSOptions=async ()=>{
    try {
    const query= `SELECT device_type, COUNT(*) as count 
    FROM fs_30_mobile_device
    GROUP BY device_type;`
    const [options] = await queryAsync(query)??[]
    console.log("devices list "+JSON.stringify(options))
    return options
    }catch (error) {
        console.log("error in get os options "+error)
    }   
 }

 export const getDeviceData=async (token)=>{
    try{
    const query= `SELECT *
    FROM fs_30_mobile_device
    Where gcm_code ="${token}"`
    const [rows]= await queryAsync(query)??[]
     console.log("devices data "+JSON.stringify(rows))
    return rows
    }catch (error){
        console.log("error in get device data "+error)
    }
 }