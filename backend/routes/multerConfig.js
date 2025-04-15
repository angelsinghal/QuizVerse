const multer = require('multer');
const path = require('path');
// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify folder where the files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Give the file a unique name
  }
});

/*
// File filter (optional: restrict to only PDFs)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};
*/

// Create an upload instance with the storage configuration
const upload = multer({storage });
module.exports = upload;