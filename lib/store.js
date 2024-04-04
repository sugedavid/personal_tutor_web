import { configureStore } from '@reduxjs/toolkit';
import mainScaffoldReducer from './slices/mainScaffoldSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      index: mainScaffoldReducer,
    },
  });
};
