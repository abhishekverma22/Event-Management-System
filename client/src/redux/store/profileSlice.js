import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProfiles: [],
  profiles: [], 
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setSelectedProfiles: (state, action) => {
      state.selectedProfiles = action.payload;
    },
    setProfiles: (state, action) => {
      state.profiles = action.payload; 
    },
    addProfile: (state, action) => {
      state.profiles.unshift(action.payload); 
      state.selectedProfiles.push(action.payload); 
    },
  },
});

export const { setSelectedProfiles, setProfiles, addProfile } = profileSlice.actions;

export default profileSlice.reducer;
