import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  //Uploads file to temp folder(disk storage) and returns the path of the file
  
const upload = multer({ 
    storage,
})

export {upload}
