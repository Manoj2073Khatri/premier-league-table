import { createSlice} from '@reduxjs/toolkit';


const initialState= { 
    modalState: false,
    name:'',
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      modalOpen: (state,action) => {
        state.modalState = true;
        state.name = action.payload;
        document.body.style.overflow = "hidden";
      },
      modalClose: (state) => {
        state.modalState = false;
        document.body.style.removeProperty('overflow');
      },
    
    },
  });

  export const { modalOpen, modalClose, fetchClubsFailure } =modalSlice.actions;
  
  export default modalSlice.reducer