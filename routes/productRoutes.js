const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    // cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid name clashes
    const filename = Date.now() + path.extname(file.originalname); // Append timestamp to avoid name clashes
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Use the upload middleware in your route
router.post('/createProduct', upload.single('productImage'), productController.createProduct);
router.get('/viewProducts/:id', productController.getProductsByUserId);
router.get('/viewAllProducts', productController.getAllProducts);
router.delete('/deleteProductById/:id', productController.deleteProductById);






// Route to create a new product
// router.post('/createProduct', productController.createProduct);

module.exports = router;
