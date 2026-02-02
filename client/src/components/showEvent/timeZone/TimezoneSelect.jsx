import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { RiExpandUpDownLine } from "react-icons/ri";
import "./TimezoneSelect.css";

const TimezoneSelect = ({ value, onChange }) => {
  const [selected, setSelected] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [timezones, setTimezones] = useState([]);

  useEffect(() => {
    setTimezones(moment.tz.names());
  }, []);

  const handleSelect = (tz) => {
    setSelected(tz);
    setOpen(false);
    setSearch("");
    if (onChange) onChange(tz);
  };

  const filteredTimezones = timezones.filter((tz) =>
    tz.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="timezone-container">
      {/* Select box */}
      <div
        className="timezone-box"
        onClick={() => setOpen(!open)}
      >
        <span>{selected || "Select Timezone"}</span>
        <RiExpandUpDownLine className={`timezone-arrow ${open ? "open" : ""}`} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="timezone-dropdown">
          {/* Search input */}
          <input
            type="text"
            className="timezone-search"
            placeholder="Search timezone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Timezone list */}
          <ul className="timezone-list">
            {filteredTimezones.map((tz) => (
              <li
                key={tz}
                className={`timezone-item ${tz === selected ? "selected" : ""}`}
                onClick={() => handleSelect(tz)}
              >
                {tz} (UTC {moment.tz(tz).format("Z")})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimezoneSelect;
