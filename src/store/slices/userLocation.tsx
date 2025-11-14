import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface LocationState {
  currentLocation: Location;
}

const initialState: LocationState = {
  currentLocation: {
    latitude: null,
    longitude: null,
  },
};

const userLocation = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
    },
    updateLocation: (state, action: PayloadAction<Partial<Location>>) => {
      state.currentLocation = { ...state.currentLocation, ...action.payload };
    },
    clearLocation: state => {
      state.currentLocation = { latitude: null, longitude: null };
    },
  },
});

export const { setLocation, updateLocation, clearLocation } =
  userLocation.actions;
export default userLocation.reducer;
