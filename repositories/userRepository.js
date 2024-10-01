const User = require('../models/userModel');

const createAdmin = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByUserName = async (userName) => {
  console.log("=====FindBy User Name Calling=====");
  
  return await User.findOne({  where: { userName } });
}

const findUserByEmail = async (email) => {
  // console.log("=============email",email);
  return await User.findOne({  where: { email } });
  // const user = User.findOne({ where: { email }  });
  // console.log("=============user",user);
  // return await User.findOne({ email });
};

const findUserByEmailAndPassword = async (email, password) => {
  try {
    const user = await User.findOne({
      where: { email, password }
    });

    return user;
  } catch (error) {
    console.error('Error finding user by email and password:', error);
    throw new Error('Database query failed');
  }
};


module.exports = {
  createAdmin,
  createUser,
  findUserByUserName,
  findUserByEmail,
  findUserByEmailAndPassword
};
