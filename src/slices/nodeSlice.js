// slices/nodeSlice.js
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
        state[index] = { ...state[index], position: action.payload.position };
      }
    },
    setNodes: (state, action) => {
      return action.payload;
    }
  },
});

export const { addNode, updateNode, setNodes } = nodeSlice.actions;
export default nodeSlice.reducer;
