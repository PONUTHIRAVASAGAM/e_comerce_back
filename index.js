// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');



const app = express();
const port = 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const crypto = require('crypto');

// Generate a random string
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log(jwtSecret);

JWT_SECRET=jwtSecret
