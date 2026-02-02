import { ProfileModel } from "../models/profile.model.js";
import { sendError, sendSuccess } from "../utils/response.helper.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

export const createProfile = async (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password) {
      return sendError(res, "Name and Password are required", 400);
    }
    const user_profile = await ProfileModel.findOne({ name });

    if (user_profile) {
      return sendError(res, "User already registered", 409);
    }

    const payload = {
      name,
      password, // Pre-save hook will hash this
      role: role || "user",
    };

    const newProfile = await ProfileModel.create(payload);
    sendSuccess(res, "User account created successfully", 201, {
      _id: newProfile._id,
      name: newProfile.name,
      role: newProfile.role,
    });

  } catch (error) {
    return sendError(res, error, 500);
  }
};

export const loginProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) return sendError(res, "All fields required", 400);

    const user = await ProfileModel.findOne({ name }).select("+password");

    if (!user || !(await user.isPasswordCorrect(password))) {
      return sendError(res, "Invalid credentials", 401);
    }

    const token = generateToken(user._id, user.role);

    // Send cookie
    // Determine environment for cookie settings
    // If we're on Render, we trust the proxy to tell us if we're secure.
    // If headers.origin contains 'vercel.app' or 'onrender.com', we should treat it as cross-site/production.
    const origin = req.headers.origin || "";
    const isProduction = process.env.NODE_ENV === "production" || origin.includes("vercel.app") || origin.includes("onrender.com");

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // Secure is required for SameSite: None
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    });

    sendSuccess(res, "Login successful", 200, {
      _id: user._id,
      name: user.name,
      role: user.role,
      token, // Also sending token in body for convenience
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const logoutProfile = async (req, res) => {
  const origin = req.headers.origin || "";
  const isProduction = process.env.NODE_ENV === "production" || origin.includes("vercel.app") || origin.includes("onrender.com");
  
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  sendSuccess(res, "Logged out successfully", 200);
};

export const getProfiles = async (req, res) => {
  try {
    // Only return password-less profiles
    const profiles = await ProfileModel.find().sort({ name: 1 });

    return sendSuccess(res, "Profiles fetched", 200, profiles);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};