const crypto = require('crypto');

// Generate a random string
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log(jwtSecret);
