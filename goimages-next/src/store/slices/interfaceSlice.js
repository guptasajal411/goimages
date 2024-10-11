import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showCreateNewAlbum: false
}

const interfaceSlice = createSlice({
    name: "interface",
    initialState,
    reducers: {
        showCreateNewAlbum(state) {
            state.showCreateNewAlbum = true
        },
        hideCreateNewAlbum(state) {
            state.showCreateNewAlbum = false
        }
    }
});

export const { showCreateNewAlbum, hideCreateNewAlbum } = interfaceSlice.actions;

export default interfaceSlice.reducer;
