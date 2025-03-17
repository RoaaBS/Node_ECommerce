import  multer  from 'multer';

export const fileValidation={
    image:['image/png','image/jpeg','image/webp'],
    pdf:['application/pdf'],
    excel:['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}
function fileUpload(customeValidation=[]){
    const storage = multer.diskStorage({});

    function fileFilter(req,file,cb){
        if(customeValidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb("invalid formate",false)
        }
      
    }

    const upload=multer({fileFilter,storage});
    return upload;
}

export default fileUpload;