import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import languageReducer from './slices/LanguageSlice';
import locationReducer from './slices/userLocation';
import draftReducer from './slices/draftSlice';

const RootReducer = combineReducers({
  auth: authReducer,
  profileAuth: profileReducer,
  language: languageReducer,
  location: locationReducer,
  draft: draftReducer,
});

export type RootState = ReturnType<typeof RootReducer>;
export default RootReducer;
