import express from 'express'
import initApp from './src/index.router.js'
import ConnectDB from './DB/connection.js'
import 'dotenv/config'
const app =express()
ConnectDB();
const PORT=process.env.PORT ||3000;
initApp(app,express);
app.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`)
})