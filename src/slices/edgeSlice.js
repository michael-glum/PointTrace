import { createSlice } from '@reduxjs/toolkit';

const edgeSlice = createSlice({
  name: 'edges',
  initialState: [],
  reducers: {
    addEdge: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addEdge } = edgeSlice.actions;
export default edgeSlice.reducer;
