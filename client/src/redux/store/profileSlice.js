import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProfiles: [],
  profiles: [], // store all profiles globally
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setSelectedProfiles: (state, action) => {
      state.selectedProfiles = action.payload;
    },
    setProfiles: (state, action) => {
      state.profiles = action.payload; // update all profiles
    },
    addProfile: (state, action) => {
      state.profiles.unshift(action.payload); // add to profile list
      state.selectedProfiles.push(action.payload); // optionally select it
    },
  },
});

export const { setSelectedProfiles, setProfiles, addProfile } = profileSlice.actions;

export default profileSlice.reducer;
