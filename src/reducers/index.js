import { combineReducers } from '@reduxjs/toolkit';
import nodeReducer from '../slices/nodeSlice';
import edgeReducer from '../slices/edgeSlice';
import argumentReducer from '../slices/argumentSlice';

const rootReducer = combineReducers({
  nodes: nodeReducer,
  edges: edgeReducer,
  argument: argumentReducer,
});

export default rootReducer;
