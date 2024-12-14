import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
import  {apiSlice}  from './slices/apiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;