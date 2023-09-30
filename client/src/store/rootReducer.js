import { configureStore } from '@reduxjs/toolkit'
import postsReducer from "./postsSlice";
// import cartReducer from './cartReducer';
// import cardReducer from "./cardSlice"
export default configureStore({
    reducer : {
        post : postsReducer, 
        // cartReducer:cartReducer,
        // card:cardReducer
    },
})