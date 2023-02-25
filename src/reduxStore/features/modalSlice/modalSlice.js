import { createSlice} from '@reduxjs/toolkit';


const initialState= { 
    modalState: false,
    dataId:'',
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      modalOpen: (state,action) => {
        state.modalState = true;
        state.dataId = action.payload;
      },
      modalClose: (state) => {
        state.modalState = false;
      },
    
    },
  });

  export const { modalOpen, modalClose, fetchClubsFailure } =modalSlice.actions;
  
  export default modalSlice.reducer