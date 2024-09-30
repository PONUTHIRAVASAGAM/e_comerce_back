const productRepository = require('../repositories/productRepository');

const createProduct = async (req, res) => {
  console.log("======req======",req.body);
  console.log("======file======", req.file);
  
    try {
      const {
        ownerId,
        productName,
        productDescription,
        // productImage,
        originalPrice,
        discountPrice,
        sellingPrice,
        quantity,
        uom,
        hsnCode,
      } = req.body;
      // Access the uploaded file path from req.file
      // const productImage = `http://localhost:3000/uploads/${req.file.filename}`;
      const productImage = req.file ? req.file.path : ''; // This will be the path to the uploaded image

      const product = await productRepository.createProduct({
        ownerId, 
        productName,
        productDescription,
        productImage,
        originalPrice,
        discountPrice,
        sellingPrice,
        quantity,
        uom,
        hsnCode,
        created_date: new Date(),
        updated_date: new Date(),
      });
  
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getProductsByUserId = async (req, res) => {
  try {
    const userId  = req.params.id;
    console.log("=====req.params=====",req.params.id);    
    const products = await productRepository.getProductsByUserId(userId);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const userId  = req.params.id;
    console.log("=====req.params=====",req.params.id);    
    const products = await productRepository.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProductById = async (req, res) => {
  console.log("=========Delete Method Calling======");
  
  try {
    const productId = req.params.id;
    console.log("=====Product ID to delete=====", productId);

    const result = await productRepository.deleteProductById(productId); 
    
    if (result) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


  
  module.exports = {
    createProduct,
    getAllProducts,
    getProductsByUserId,
    deleteProductById,
  };