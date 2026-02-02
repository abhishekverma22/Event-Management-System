import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import SelectProfile from "../profileSelect/SelectProfile";
import { useDispatch } from "react-redux";
import { setSelectedProfiles } from "../../redux/store/profileSlice";
import axios from "axios";
import "./EditEvent.css";

const EditEvent = ({ event, onClose, onUpdated }) => {
  const dispatch = useDispatch();

  const [timezone, setTimezone] = useState(event.time_zone);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // ✅ PREFILL DATA WHEN MODAL OPENS
  useEffect(() => {
    // 👉 THIS IS THE MOST IMPORTANT LINE
    dispatch(setSelectedProfiles(event.participants || []));

    const start = moment.utc(event.start_date_time).tz(event.time_zone);
    const end = moment.utc(event.end_date_time).tz(event.time_zone);

    setStartDate(start.format("YYYY-MM-DD"));
    setStartTime(start.format("HH:mm"));
    setEndDate(end.format("YYYY-MM-DD"));
    setEndTime(end.format("HH:mm"));
  }, [event, dispatch]);

  const handleUpdate = async () => {
    const start_date_time = moment
      .tz(`${startDate} ${startTime}`, timezone)
      .toISOString();

    const end_date_time = moment
      .tz(`${endDate} ${endTime}`, timezone)
      .toISOString();

    await axios.put(`/api/event/${event._id}`, {
      participants: event.participants.map(p => p._id),
      time_zone: timezone,
      start_date_time,
      end_date_time,
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>Edit Event</h2>

        {/* ✅ USERS ALREADY SELECTED */}
        <SelectProfile />

        <div className="timezone-select">
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {moment.tz.names().map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div className="date-time-row">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>

        <div className="date-time-row">
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>

        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
