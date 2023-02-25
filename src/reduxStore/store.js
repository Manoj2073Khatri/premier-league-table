import { configureStore } from '@reduxjs/toolkit';
import premereLeagueReducer from './features/premereLeagueSlice/premereLeagueSlice';

export const store = configureStore({
  reducer: {
    premierLeague: premereLeagueReducer
  },
});
