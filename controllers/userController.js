const userRepository = require('../repositories/userRepository');

const registerAdmin = async (req, res) => {
  try {
    const { userName, email, password ,role} = req.body;
    console.log("=============email",email);

    const existingUserByEmail = await userRepository.findUserByEmail(email);
    const existingUserByName = await userRepository.findUserByUserName(userName);
      if (existingUserByEmail) {
          return res.status(400).json({ message: 'Email is already in use' });
            }
      if (existingUserByName) {
          return res.status(400).json({ message: 'Username is already in use' });
            }
    // const existingUser = await userRepository.findUserByEmail(email);
    // console.log("=============User",existingUser);
    

    // if (existingUser) {
      // return res.status(400).json({ message: 'User already exists' });
    // }

    const passcode = await bcrypt.hash(password, 10);

    const user = await userRepository.createAdmin({ userName, email, password,passcode,role,status: 'ENABLED' });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const otpStorage = {}; // Temporary in-memory storage for OTPs

const registerUser = async (req, res) => {
  try {
    const { userName, email, role } = req.body;

    const existingUserByEmail = await userRepository.findUserByEmail(email);
    const existingUserByName = await userRepository.findUserByUserName(userName);

    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    if (existingUserByName) {
      return res.status(400).json({ message: 'Username is already in use' });
    }

    
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    otpStorage[email] = otp; // Store OTP temporarily
    console.log("=======otp=======",otp);
    console.log("=======otpStorage[email]=======",otpStorage[email]);

  
    const newUser = await userRepository.createUser({
      userName,
      email,
      password: '', 
      role,
      status: 'DISABLED',
    });

    // Send the OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: 'youremail@gmail.com', // Your email
        pass: '	yourCode', // Your email password
      },
    });

    const mailOptions = {
      from: 'youremail@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP' });
      } else {
        return res.status(200).json({ message: 'OTP sent successfully', otpSent: true });
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 

const OTP_EXPIRATION_TIME = 15 * 60 * 1000; // OTP valid for 15 minutes
const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
    
  console.log("=============req.body============",req.body);
  console.log("=============req==========",req);

  console.log("=======otpStorage[email]=======", otpStorage[email]);

  // Check if OTP is valid and not expired
  const storedOtpData = otpStorage[email];
  console.log("=======storedOtpData=======", storedOtpData);
  console.log("=======otp=======", otp);

  if (storedOtpData === otp) {
    // Check if OTP is expired
    const isExpired = (Date.now() - storedOtpData.timestamp) > OTP_EXPIRATION_TIME;
    if (isExpired) {
      delete otpStorage[email]; // Clear the OTP after expiration
      return res.status(400).json({ message: 'OTP has expired' });
    }

    delete otpStorage[email]; // Clear the OTP after verification

    // Hash the new password
    const passcode = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds

    // Update the user's password and set status to ENABLE
    try {
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Directly update the user's password and status
      user.password = newPassword;
      user.passcode = passcode;
      user.status = 'ENABLED';
      await user.save();

      return res.status(200).json({ message: 'OTP verified and password set successfully' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
};

// const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const authenticateUser = async (req, res) => {
  console.log("=====AuthenticateUser Method Calling=====");

    const { userName, password } = req.body;

    try {
        // const result = await userRepository.findUserByUserName(userName);
        const result = await userRepository.findUserByEmail(userName);
        const user = result.dataValues;

        console.log("=====PasswordIN=====", password);
        console.log("=====PasswordDB=====", user.password);

        // Validate user credentials
        if (!user || password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Directly define the JWT secret
        const JWT_SECRET = '95428372f1f24ab015706bf30bfcae8e6a8177379eb34f20bc1e32849c7315d7'; // Replace with your actual secret

        // Log the JWT secret for debugging (optional)
        console.log('JWT Secret:', JWT_SECRET); // Debug line

        // Generate token
        const token = jwt.sign(
            { userId: user.userId, userName: user.userName },
            JWT_SECRET,
            // { expiresIn: '1h' }
        );

        console.log("======Token=====", token);
        res.json({accessToken: token,user:{userId: result.userId,
          userName: result.userName,
          email: result.email,
          role:result.role,
          status:result.status }});

        // res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
};


// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
      return res.sendStatus(403);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      req.user = user;
      next();
  });
};


module.exports = {
  registerAdmin,
  registerUser,
  verifyOtp,
  authenticateUser,
  authenticateJWT
};
