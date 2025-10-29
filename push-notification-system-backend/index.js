import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import notificationRouter from './routes/notification.route.js'
import devicesRouter from './routes/devicesList.route.js'
import refreshRouter from './routes/refreshToken.route.js'
import logoutRouter from './routes/logout.route.js'
import { getCountriesOptions, getDevicesTokens, getLanguagesOptions, getOSOptions } from './devicesDatabase.js'
import authRouter from './routes/auth.route.js'
import corsOptions from './config/corsOptions.js'
import credentials from './middlewares/credentials.js'
import cookieParser from 'cookie-parser';
const app =express()
app.use(credentials);
app.use(cors(corsOptions)); 
app.use(express.json())
app.use(cookieParser());
//allow other types of body data formats to be processed
app.use(express.urlencoded({extended:false}))
// console.log("getDevicesTokens "+JSON.stringify(getDevicesTokens("jo","ar","ios")))
 app.use('/refresh',refreshRouter)
 app.use('/api/notifications',notificationRouter)
 app.use('/api/devices',devicesRouter)
 app.use ('/auth',authRouter)

 app.use('/logout',logoutRouter)
mongoose.connect('mongodb://mongo:27017/notification-system-db')
    .then(() => console.log('Connected!'));


  
app.listen (4000,()=>{
    console.log('server is running on port 4000')
})
