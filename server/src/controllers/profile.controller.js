import { ProfileModel } from "../models/profile.model.js";
import { sendError, sendSuccess } from "../utils/response.helper.js";

export const createProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return sendError(res, "Required User Name..", 400);
    }
    const user_profile = await ProfileModel.findOne({ name });

    if (user_profile) {
      return sendError(res, "User already registered", 409);
    }

    const payload = {
      name,
    };

    const newProfile = await ProfileModel.create(payload);
    sendSuccess(res, "User account create successfully", 201);
  } catch (error) {
    return sendError(res, error, 500);
  }
};
