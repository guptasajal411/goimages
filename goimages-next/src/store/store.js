import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            userReducer: userSlice
        },
    });
};
