import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event id is required"],
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: [true, "User id is required"],
    },

    changes: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export const EventLogModel = mongoose.model("EventLog", eventLogSchema);
