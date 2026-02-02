import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProfiles, setProfiles, addProfile } from "../../redux/store/profileSlice.js"
import { RiExpandUpDownLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import api from "../../api/axios";
import "./SelectProfile.css";

const SelectProfile = ({width}) => {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profile.profiles);
  const selectedProfiles = useSelector((state) => state.profile.selectedProfiles);

  const [open, setOpen] = useState(false);
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
        const validProfiles = res.data.data.filter((p) => p && p.name);
        dispatch(setProfiles(validProfiles));
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  // Toggle selection
  const toggleProfile = (profile) => {
    const exists = selectedProfiles.find((p) => p._id === profile._id);
    const updated = exists
      ? selectedProfiles.filter((p) => p._id !== profile._id)
      : [...selectedProfiles, profile];

    dispatch(setSelectedProfiles(updated));
  };

  // Add new profile
  const handleAddProfile = async () => {
    if (!newUser.trim()) return;

    try {
      const res = await api.post("/api/create-profile", { name: newUser });
      if (res.data.data) {
        dispatch(addProfile(res.data.data)); // add and select globally
        setNewUser(""); // clear input
        setOpen(true);
      }
    } catch (err) {
      console.error("Error adding profile:", err);
    }
  };

  const filteredProfiles = profiles.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="multi-select">
      <div className="select-box"  onClick={() => setOpen(!open)} style={{width: width}}>
        <span>
          {selectedProfiles.length
            ? `${selectedProfiles.length} profile${selectedProfiles.length > 1 ? "s" : ""} selected`
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
            onKeyDown={(e) => e.key === "Enter" && handleAddProfile()}
          />

          <ul className="user-list">
            {filteredProfiles.map((profile) => {
              const isActive = selectedProfiles.some((p) => p._id === profile._id);
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
            />
            <button onClick={handleAddProfile}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectProfile;
