const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (['.jpg', '.jpeg', '.png'].includes(ext) && mime.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG images are allowed'), false);
  }
};
const limits = {
  fileSize: 5 * 1024 * 1024, 
};
const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
