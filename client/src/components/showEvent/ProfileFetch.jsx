import { useEffect, useState } from "react";
import { RiExpandUpDownLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import api from "../../api/axios";
import ProfileDetails from "./ProfileDetails";
import TimezoneSelect from "./timeZone/TimezoneSelect";
import "../profileSelect/SelectProfile.css";

const ProfileFetch = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await api.get("/api/get-profile");
      if (Array.isArray(res.data.data)) setProfiles(res.data.data);
    } catch (err) {
      console.error("Fetch profile error", err);
    }
  };

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (profile) => {
    setSelectedProfile(profile);
    setOpen(false);
  };

  return (
    <div>
      {/* SELECT BOXES CONTAINER */}
      <div className="selects-container" style={{ display: "flex", alignItems: "center", gap:"30px" }}>
        {/* Profile Select */}
        <div className="multi-select" style={{ flex: 1  }}>
          <div className="select-box" onClick={() => setOpen(!open)}>
            <span>
              {selectedProfile ? selectedProfile.name : "Select User"}
            </span>
            <RiExpandUpDownLine />
          </div>

          {open && (
            <div className="dropdown">
              <input
                className="search"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ul className="user-list">
                {filteredProfiles.map((profile) => (
                  <li
                    key={profile._id}
                    className={`user-item ${
                      selectedProfile?._id === profile._id ? "active" : ""
                    }`}
                    onClick={() => handleSelect(profile)}
                  >
                    {profile.name}
                    {selectedProfile?._id === profile._id && (
                      <span className="tick">
                        <FaCheck />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Timezone Select */}
        <div className="timezone-select" style={{ flex: 1}}>
          <TimezoneSelect value={timezone} onChange={(tz) => setTimezone(tz)} />
        </div>
      </div>

      {/* EVENTS DETAILS */}
      {selectedProfile && (
        <ProfileDetails profile={selectedProfile} timezone={timezone} />
      )}
    </div>
  );
};

export default ProfileFetch;
