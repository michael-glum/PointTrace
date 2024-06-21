import { createSlice } from '@reduxjs/toolkit';

const nodeSlice = createSlice({
  name: 'nodes',
  initialState: [],
  reducers: {
    addNode: (state, action) => {
      state.push(action.payload);
    },
    updateNode: (state, action) => {
      const index = state.findIndex(node => node.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addNode, updateNode } = nodeSlice.actions;
export default nodeSlice.reducer;