import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authslice';
import  {apiSlice}  from './Slices/apiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;