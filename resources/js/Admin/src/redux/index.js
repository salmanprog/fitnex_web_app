//import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
// import data from "./data";

// export default configureStore({ reducer: { auth, data } });


import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
const reducer = combineReducers({
  // here we will be adding reducers
  auth
})
const store = configureStore({
  reducer,
})
export default store;