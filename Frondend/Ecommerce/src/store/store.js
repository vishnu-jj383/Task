import { configureStore } from "@reduxjs/toolkit";
import sideReducer from "../reducers/sideBarReducer"
const store = configureStore({
    reducer: {
        sidebar: sideReducer
    }
})

export default store