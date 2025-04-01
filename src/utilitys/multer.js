import multer from "multer";

export const fileValidation = {
    image: ["image/png", "image/jpeg", "image/webp"],
    pdf: ["application/pdf"],
    excel: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
};

function fileUpload(customValidation = []) {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file format"), false);
        }
    }

    const upload = multer({ storage, fileFilter });
    return upload;
}

export default fileUpload;
