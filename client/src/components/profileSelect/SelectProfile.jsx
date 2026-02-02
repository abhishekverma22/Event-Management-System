import { useEffect, useState } from "react";
import { RiExpandUpDownLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import api from "../../api/axios";
import "./SelectProfile.css";

const SelectProfile = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState("");

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await api.get("/api/get-profile");
      if (Array.isArray(res.data.data)) {
        setProfiles(res.data.data.filter((p) => p && p.name));
      } else {
        setProfiles([]);
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setProfiles([]);
    }
  };

  // Toggle profile selection
  const toggleProfile = (profile) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p._id === profile._id);
      const updated = exists
        ? prev.filter((p) => p._id !== profile._id)
        : [...prev, profile];
      onChange(updated);
      return updated;
    });
  };

  // Add new profile and fetch updated list
  const addProfile = async () => {
    if (!newUser.trim()) return;

    try {
      await api.post("/api/create-profile", { name: newUser });
      setNewUser(""); // clear input immediately

      // Fetch the updated profiles from backend
      await fetchProfiles();

      setOpen(true); // keep dropdown open
    } catch (err) {
      console.error("Error adding profile:", err);
    }
  };

  // Filter profiles based on search input
  const filteredProfiles = profiles.filter(
    (p) => p && p.name && p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="multi-select">
      <div className="select-box" onClick={() => setOpen(!open)}>
        <span>
          {selected.length
            ? `${selected.length} profile${selected.length > 1 ? "s" : ""} selected`
            : "Select current profile"}
        </span>
        <RiExpandUpDownLine />
      </div>

      {open && (
        <div className="dropdown">
          <input
            className="search"
            placeholder="Search profile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <ul className="user-list">
            {filteredProfiles.map((profile) => {
              const isActive = selected.some((p) => p._id === profile._id);
              return (
                <li
                  key={profile._id}
                  className={`user-item ${isActive ? "active" : ""}`}
                  onClick={() => toggleProfile(profile)}
                >
                  {profile.name}
                  {isActive && <span className="tick"><FaCheck /></span>}
                </li>
              );
            })}
          </ul>

          <div className="add-user">
            <input
              placeholder="Add new user"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addProfile();
              }}
            />
            <button onClick={addProfile}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectProfile;
