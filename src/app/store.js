import { configureStore, combineReducers } from '@reduxjs/toolkit';
import loginReducer from '../features/auth/loginSlice.js';
import registerReducer from '../features/auth/registerSlice.js';

const authReducer = combineReducers({
    login: loginReducer,
    register: registerReducer,
});

const store = configureStore({
    reducer: {
        auth: authReducer, 
    },
});

export default store;
