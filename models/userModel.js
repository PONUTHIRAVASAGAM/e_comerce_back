const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance and connect to the database
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/e-commerce');

// Define the User model
const User = sequelize.define('User', {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  passcode: { // Changed from password to passcode
    type: DataTypes.STRING,
    // allowNull: false,
  },
  role: { // Added role column
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USER', // You can set a default value if needed
  },
  status: { // Added role column
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'DISABLED', // You can set a default value if needed
  },
}, {
  // Other model options go here
});

// Synchronize the model with the database
sequelize.sync()
  .then(() => {
    console.log('User table created successfully!');
  })
  .catch((err) => {
    console.error('Unable to create table:', err);
  });

module.exports = User;
