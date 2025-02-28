import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import novelReviewReducer from "./novelReviewSlice";
import novelRecReducer from "./novelRecSlice";
import storyReducer from "./storySlice";
import biographyReducer from "./biographySlice";
import poetryReducer from "./poetrySlice";

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    novelReview: novelReviewReducer,
    novelRec: novelRecReducer,
    story: storyReducer,
    biography: biographyReducer,
    poetry: poetryReducer
    
});

const store = configureStore({
    reducer: rootReducer,  
});
export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;