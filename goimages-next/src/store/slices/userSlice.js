import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
    authenticated: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.userInfo = action.payload;
            state.authenticated = true;
        },
        logoutUser(state) {
            state.userInfo = null;
            state.authenticated = false;
        }
    }
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
