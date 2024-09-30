const Product = require('../models/productModel');

const createProduct = async (productData) => {
    return await Product.create(productData);
  };

  const getProductsByUserId = async (userId) => {
  console.log("=====userId=====",userId);  
  return await Product.findAll({ where: { ownerId: userId } });
  };
  
const getAllProducts = async () => {
  // console.log("=====userId=====",userId);  
  return await Product.findAll();
};

const deleteProductById = async (productId) => {
  try {
    const result = await Product.destroy({ where: { productId: productId } });
    return result;
  } catch (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
};


  module.exports = {
    createProduct,
    getProductsByUserId,
    getAllProducts,
    deleteProductById,
  };