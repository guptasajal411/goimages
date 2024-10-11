import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedPhotosForAlbum: []
}

const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {
        addToAlbum(state, action) {
            state.selectedPhotosForAlbum = [...state.selectedPhotosForAlbum, action.payload];
        },
        removeFromAlbum(state, action) {
            state.selectedPhotosForAlbum = state.selectedPhotosForAlbum.filter(id => id !== action.payload)
        }
    }
});

export const { addToAlbum, removeFromAlbum } = albumSlice.actions;

export default albumSlice.reducer;
