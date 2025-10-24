import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  mobile: string;
  email: string;
}

interface AuthState {
  user: User | null;
  userType: string | null;
  userToken: string;
}

const initialState: AuthState = {
  user: null,
  userType: null,
  userToken: '',
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
    userToken: (state, action: PayloadAction<any>) => {
      state.userToken = action.payload;
    },
    clearUser: state => {
      state.user = null;
      state.userType = null;
      state.userToken = '';
    },
  },
});

export const { setUser, setUserType, clearUser, userToken } = authSlice.actions;
export default authSlice.reducer;
