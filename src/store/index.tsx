import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import novelReviewReducer from "./novelReviewSlice";

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    novelReview: novelReviewReducer
    
});

const store = configureStore({
    reducer: rootReducer,  
});
export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;