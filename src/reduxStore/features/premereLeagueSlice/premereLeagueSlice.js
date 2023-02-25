import { createSlice} from '@reduxjs/toolkit';


const initialState= { 
    clubs: [], 
    loading: false 
}

export const premierLeagueSlice = createSlice({
    name: 'premierLeague',
    initialState,
    reducers: {
      fetchClubsStart: (state) => {
        state.loading = true;
      },
      fetchClubsSuccess: (state, action) => {
        state.clubs = action.payload;
        state.loading = false;
       
      },
      fetchClubsFailure: (state) => {
        state.loading = false;
      },
    },
  });

  export const { fetchClubsStart, fetchClubsSuccess, fetchClubsFailure } =premierLeagueSlice.actions;
  
  export default premierLeagueSlice.reducer