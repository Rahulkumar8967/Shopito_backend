const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwtProvider = require("../config/jwtProvider.js");

const createUser = async (userData) => {
  try {
    let { firstName, lastName, email, password, role } = userData;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      throw new Error(`User already exists with email: ${email}`);
    }

    password = await bcrypt.hash(password, 8);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    console.log("User created:", user);

    return user;
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error(error.message);
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId).populate("address");
    if (!user) {
      throw new Error(`User not found with id: ${userId}`);
    }
    return user;
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error(error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }

    return user;
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error(error.message);
  }
};

const getUserProfileByToken = async (token) => {
  try {
    const userId = jwtProvider.getUserIdFromToken(token);

    console.log("User ID:", userId);

    const user = await findUserById(userId);
    
    if (!user) {
      throw new Error(`User does not exist with id: ${userId}`);
    }

    user.password = null;
    return user;
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error(error.message);
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  findUserById,
  getUserProfileByToken,
  getUserByEmail,
  getAllUsers,
};
