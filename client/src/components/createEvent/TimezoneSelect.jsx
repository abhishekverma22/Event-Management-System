import React, { useState } from "react";
import moment from "moment-timezone";

const TimezoneSelect = ({ value, onChange }) => {
  const [selected, setSelected] = useState(value || "");

  const timezones = moment.tz.names(); 

  const handleChange = (e) => {
    setSelected(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <select value={selected} onChange={handleChange} style={{ width: "100%", padding: "8px" }}>
      <option value="">Select Timezone</option>
      {timezones.map((tz) => (
        <option key={tz} value={tz}>
          {tz} (UTC {moment.tz(tz).format("Z")})
        </option>
      ))}
    </select>
  );
};

export default TimezoneSelect;
