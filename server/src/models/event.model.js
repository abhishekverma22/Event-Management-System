import mongoose from "mongoose";
import moment from "moment-timezone";

const eventSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
      },
    ],

    time_zone: {
      type: String,
      required: [true, "Timezone is required"],
      default: "UTC",
      validate: {
        validator: function (value) {
          return !!moment.tz.zone(value);
        },
        message: "Invalid timezone provided",
      },
    },

    start_date_time: {
      type: Date,
      required: true,
    },

    end_date_time: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const EventModel = mongoose.model("Event", eventSchema);
