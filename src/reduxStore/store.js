import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './features/modalSlice/modalSlice';
import premereLeagueReducer from './features/premereLeagueSlice/premereLeagueSlice';

export const store = configureStore({
  reducer: {
    premierLeague: premereLeagueReducer,
    modal:modalReducer,
  },
});
