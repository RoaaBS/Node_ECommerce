import cors from 'cors'

const initApp = async(app,express)=>{
    app.use(express.json());
    app.use(cors());
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"welcome ..."})
    });
    app.get('*',(req,res)=>{
        return res.status(404).json({message:"page not found ..."})
    });

};
export default initApp;