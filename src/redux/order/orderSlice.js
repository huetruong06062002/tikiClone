import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


const initialState = {
  carts:  [], 
};

/**
  carts = [
    {quantity: 1, _id : 'abc', detail: { _id: 'abc', name: 'def' } },
    {quantity: 1, _id : '123', detail: { _id: '123', name: '456' } },
  ] 
 
 */

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    doAddBookAction: (state, action) => {
      let carts = state.carts;
      const item = action.payload

      let isExistIndex = carts.findIndex(c => c._id === item._id);

      if(isExistIndex > -1) {
        carts[isExistIndex].quantity =  carts[isExistIndex].quantity + item.quantity;
        if(carts[isExistIndex].quanity > item.quantity){
          carts[isExistIndex].quanity = item.quantity;
        }
      }else {
        carts.push({quantity: item.quantity, _id : item._id, detail: item.detail});
      }
      //update redux
      state.carts = carts;
    },
    extraReducers: (builder) => {},
  },
});

export const { doAddBookAction } = orderSlice.actions;


export default orderSlice.reducer;
