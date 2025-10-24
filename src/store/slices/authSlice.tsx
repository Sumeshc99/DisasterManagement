import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  mobile: string;
  email: string;
}

interface AuthState {
  user: User | null;
  userType: string | null;
  isUserRegistered: boolean;
  isSubscriptionActive?: boolean;
}

const initialState: AuthState = {
  user: null,
  userType: null,
  isUserRegistered: false,
  isSubscriptionActive: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
    },
    setIsSubscriptionActive: (state, action: PayloadAction<boolean>) => {
      state.isSubscriptionActive = action.payload;
    },
    clearUser: state => {
      state.user = null;
      state.userType = null;
      state.isUserRegistered = false;
      state.isSubscriptionActive = false;
    },
    isUserRegistered: (state, action: PayloadAction<any>) => {
      state.isUserRegistered = action.payload;
    },
  },
});

export const {
  setUser,
  setUserType,
  setIsSubscriptionActive,
  clearUser,
  isUserRegistered,
} = authSlice.actions;
export default authSlice.reducer;
