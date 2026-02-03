import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedProfiles,
  setProfiles,
  addProfile,
} from "../../redux/store/profileSlice";
import { RiExpandUpDownLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import api from "../../api/axios";
import "./SelectProfile.css";

const SelectProfile = ({ width = "100%" }) => {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profile.profiles);
  const selectedProfiles = useSelector(
    (state) => state.profile.selectedProfiles
  );

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await api.get("/api/get-profile");
      if (Array.isArray(res.data.data)) {
        dispatch(setProfiles(res.data.data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProfile = (profile) => {
    const exists = selectedProfiles.some((p) => p._id === profile._id);
    const updated = exists
      ? selectedProfiles.filter((p) => p._id !== profile._id)
      : [...selectedProfiles, profile];

    dispatch(setSelectedProfiles(updated));
  };

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="multi-select">
      <div
        className="select-box"
        onClick={() => setOpen(!open)}
        style={{ width }}
      >
        <span>
          {selectedProfiles.length
            ? selectedProfiles.map((p) => p.name).join(", ")
            : "Select users"}
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
              const isActive = selectedProfiles.some(
                (p) => p._id === profile._id
              );
              return (
                <li
                  key={profile._id}
                  className={`user-item ${isActive ? "active" : ""}`}
                  onClick={() => toggleProfile(profile)}
                >
                  {profile.name}
                  {isActive && (
                    <span className="tick">
                      <FaCheck />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectProfile;
