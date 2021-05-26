const multer = require('multer');
const { v4: uuidv4 } = require('uuid')
const path = require('path');
const multerStoragePath = path.join('data', 'images')

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	cb(null, multerStoragePath);
	},
	 filename: (req, file, cb) => {
	cb(null, uuidv4() + '-' + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
    if(['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)){
        return cb(null, true)
    }
    return cb(null, false)
}

module.exports = multer({storage: fileStorage, fileFilter}).single('image')