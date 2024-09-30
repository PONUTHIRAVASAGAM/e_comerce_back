const { Client } = require('pg');

const connectDB = async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'e-commerce'
  });

  try {
    await client.connect();
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('Error connecting to PostgreSQL', err.message);
    process.exit(1);
  }

  return client;  // Return the client so it can be used elsewhere in your app
};

module.exports = connectDB;
