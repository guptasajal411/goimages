import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import interfaceSlice from "./slices/interfaceSlice";
import albumSlice from "./slices/albumSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            userReducer: userSlice,
            interfaceReducer: interfaceSlice,
            albumReducer: albumSlice
        },
    });
};
