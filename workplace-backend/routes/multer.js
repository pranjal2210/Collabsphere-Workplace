var multer = require('multer');
var serverpath = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, 'public/images');
        },
        filename: (req, file, cb) => {
            //path(null,req.body.fname+file.originalname.substring(file.originalname.indexOf('.')))
            cb(null, Date.now() + '-' + file.originalname);
        }
    }
);
var upload = multer({ storage: serverpath });
module.exports = upload;