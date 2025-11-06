import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  user: null,
};

const draftSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserDraft: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearUserDraft: state => {
      state.user = null;
    },
  },
});

export const { setUserDraft, clearUserDraft } = draftSlice.actions;
export default draftSlice.reducer;
