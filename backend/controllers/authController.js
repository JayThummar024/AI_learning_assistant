import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

//@desc Register a new User
//@route POST /api/auth/register
//@access Public
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: userExists.email === email ? "Email already in use" : "Username already in use",
        statusCode: 400,
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
      statusCode: 201,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc Login User
//@route POST /api/auth/login
//@access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.find.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
        statusCode: 401,
      });
    }
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

//@desc getUser Profile
//@route GET /api/auth/profile
//@access Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      data: user,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

//@desc Update User Profile
//@route PUT /api/auth/profile
//@access Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }

    const { username, email } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();
    res.status(200).json({
      success: true,
      data: user,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

//@desc Change User Password
//@route PUT /api/auth/change-password
//@access Private
const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }
    const { currentPassword, newPassword } = req.body;
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
        statusCode: 401,
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

export { register, generateToken, login, getProfile, updateProfile, changePassword };
