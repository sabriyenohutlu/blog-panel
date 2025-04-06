import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import novelReviewReducer from "./novelReviewSlice";
import novelRecReducer from "./novelRecSlice";
import storyReducer from "./storySlice";
import biographyReducer from "./biographySlice";
import poetryReducer from "./poetrySlice";
import dailyWordReducer from "./dailyWordSlice";
import userReducer from "./userSlice";
import categoriesReducer from "./categorySlice";
import postCategoriesReducer from "./postCategorySlice";
import authorReducer  from "./authorSlice";

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    novelReview: novelReviewReducer,
    novelRec: novelRecReducer,
    story: storyReducer,
    biography: biographyReducer,
    poetry: poetryReducer,
    dailyWord : dailyWordReducer,
    users: userReducer,
    categories: categoriesReducer,
    postCategories: postCategoriesReducer,
    author:authorReducer
    
});

const store = configureStore({
    reducer: rootReducer,  
});
export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;