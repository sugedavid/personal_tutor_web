// lib/slices/mainScaffoldSlice.js

import { createSlice } from '@reduxjs/toolkit';

const mainScaffoldSlice = createSlice({
  name: 'index',
  initialState: {
    value: 0,
  },
  reducers: {
    setIndex: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setIndex } = mainScaffoldSlice.actions;
export default mainScaffoldSlice.reducer;
