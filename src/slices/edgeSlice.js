import { createSlice } from '@reduxjs/toolkit';

const edgeSlice = createSlice({
  name: 'edges',
  initialState: [],
  reducers: {
    setEdges: (state, action) => {
      return action.payload;
    },
    addEdge: (state, action) => {
      state.push(action.payload);
    },
    updateEdge: (state, action) => {
      const index = state.findIndex(edge => edge.id === action.payload.id);
      if (index >= 0) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
  },
});

export const { setEdges, addEdge, updateEdge } = edgeSlice.actions;
export default edgeSlice.reducer;