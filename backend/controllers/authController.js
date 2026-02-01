import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

//@desc Login User
//@route POST /api/auth/login
//@access Public            
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.find
        .findOne({ email })
        .select("+password");
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
export const getProfile = async (req, res, next) => {
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
export const updateProfile = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};

//@desc Change User Password
//@route PUT /api/auth/change-password
//@access Private            
export const changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id
        ).select("+password");
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

