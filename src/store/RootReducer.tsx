import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import languageReducer from './slices/LanguageSlice';
import locationReducer from './slices/userLocation';

const RootReducer = combineReducers({
  auth: authReducer,
  profileAuth: profileReducer,
  language: languageReducer,
  location: locationReducer,
});

export type RootState = ReturnType<typeof RootReducer>;
export default RootReducer;
