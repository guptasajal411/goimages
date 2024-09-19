import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
    authenticated: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            console.log("setting user")
            console.log(action)
            state.userInfo = action.payload;
            state.authenticated = true;
            console.log(state)
        },
        logoutUser(state) {
            state.userInfo = null;
            state.authenticated = false;
        }
    }
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
