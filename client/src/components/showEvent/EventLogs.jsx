import React, { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import moment from "moment-timezone";
import api from "../../api/axios";
import "./ProfileDetails.css"; 
import "./EventLogs.css";

const EventLogs = ({ event, allProfiles, timezone, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [event._id]);

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/api/event/logs/${event._id}`);
      setLogs(res.data.success && Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "-";
    return timezone
      ? moment(date).tz(timezone).format("D-MMM-YYYY hh:mm A")
      : moment(date).format("D-MMM-YYYY hh:mm A");
  };

  const getProfileName = (id) => {
    const p = allProfiles?.find((prof) => prof._id === id);
    return p ? p.name : id; 
  };

  const renderValue = (key, val) => {
    if (key === "participants" && Array.isArray(val)) {
      return val.map(id => getProfileName(id)).join(", ");
    }
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object" && val !== null) return JSON.stringify(val);
    return String(val);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box" style={{ maxWidth: "600px" }}>
        <h2>Event Logs</h2>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
          History for: <strong>{event.name || "Event"}</strong>
        </p>

        <div className="logs-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {loading ? (
            <p>Loading logs...</p>
          ) : logs?.length === 0 ? (
            <p>No update history yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="log-item" style={{ marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <strong>{log.updated_by?.name || "System"}</strong> • <FaRegClock /> {formatTime(log.createdAt)}
                </div>
                
                {Object.entries(log.changes || {}).map(([key, change]) => (
                  <div key={key} style={{ fontSize: "0.9em", marginBottom: "2px" }}>
                    <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{key.replace(/_/g, " ")}: </span>
                    <span style={{ color: "#d9534f", textDecoration: "line-through", marginRight: "6px" }}>
                      {key.includes("date_time") ? formatTime(change.old) : renderValue(key, change.old)}
                    </span>
                    <span style={{ color: "#28a745" }}>
                      {key.includes("date_time") ? formatTime(change.new) : renderValue(key, change.new)}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="dialog-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EventLogs;
