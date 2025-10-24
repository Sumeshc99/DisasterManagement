import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  language: string;
  en: Record<string, string>;
  ar: Record<string, string>;
}

const initialState: LanguageState = {
  language: 'en',
  en: {},
  ar: {},
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    storeText: (state, action: PayloadAction<any>) => {
      state.en = action.payload.en;
      state.ar = action.payload.ar;
    },
    clearLanguage: state => {
      state.language = 'en';
      state.en = {};
      state.ar = {};
    },
  },
});

export const { setLanguage, storeText, clearLanguage } = languageSlice.actions;
export default languageSlice.reducer;
