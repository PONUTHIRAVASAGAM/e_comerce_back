const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance and connect to the database
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/e-commerce');

// Define the Product model
const Product = sequelize.define('Product', {
  productId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ownerId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uom: { // Unit of Measure
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  hsnCode: { // Harmonized System Nomenclature Code
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  // timestamps: false,
  tableName: 'Products', // Specify the table name
});

// Synchronize the model with the database
sequelize.sync()
  .then(() => {
    console.log('Products table created successfully!');
  })
  .catch((err) => {
    console.error('Unable to create table:', err);
  });

module.exports = Product;
