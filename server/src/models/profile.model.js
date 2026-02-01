import mongoose from "mongoose";
import moment from "moment-timezone";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required.."],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
  },
  { timestamps: true },
);

export const ProfileModel = mongoose.model("Profile", profileSchema);
