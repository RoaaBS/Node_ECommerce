import mongoose from "mongoose";

const ConnectDB=async()=>{
    return await mongoose.connect(process.env.DB).then(()=>{
        console.log("DataBase connection established");
    }).catch((err)=>{
        console.log(`error to connect database :${err}`)
    })

}
export default ConnectDB;