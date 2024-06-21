import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

const store = configureStore({
  reducer: rootReducer,
  middleWare: (getDefaultMiddleware) => getDefaultMiddleware.concat(),
});

export default store;