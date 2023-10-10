import multer from 'multer';
import logger from '../utils/logger.js';

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(file.fieldname === "profileImage"){
                cb(null, 'public/img/profiles');
            } else if (file.fieldname === "productImage"){
                cb(null, 'public/img/products');
            } else {
                cb(null, 'public/documents');
            }
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + req.user?.name +file.originalname);
        },
    });

    export const uploadGeneric = multer({ storage });

    