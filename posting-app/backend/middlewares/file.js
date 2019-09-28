const multer = require('multer');
const MiNE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    const isValid = MiNE_TYPE_MAP[file.mimetype]
    let error = new Error("Invalid mime type")
    if(isValid)
    {
      error = null;
    }
      cb(error, './uploads/')
  },
  filename: (req, file, cb)=> {
      const name = file.originalname.toLowerCase().split(" ").join('-');
      const ext =  MiNE_TYPE_MAP[file.mimetype]
      cb(null, name+ '-' + Date.now() + '.'+ ext);
  }
});
module.exports = multer({ storage: storage, limits:{fieldSize: 25 * 1024 * 1024}}).array("images[]", 12);
