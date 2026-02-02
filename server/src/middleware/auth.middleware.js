import jwt from "jsonwebtoken";
import { ProfileModel } from "../models/profile.model.js";
import { sendError } from "../utils/response.helper.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendError(res, "Unauthorized request", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    const user = await ProfileModel.findById(decoded.id);

    if (!user) {
      return sendError(res, "Invalid Access Token", 401);
    }

    req.profile = user;
    next();
  } catch (error) {
    return sendError(res, "Invalid or expired token", 401);
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.profile && req.profile.role === "admin") {
    next();
  } else {
    return sendError(res, "Admin access required", 403);
  }
};
