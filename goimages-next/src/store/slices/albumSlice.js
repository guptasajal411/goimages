import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedPhotosForAlbum: [],
    userAlbumsList: []
}

const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {
        addToAlbum(state, action) {
            if (!state.selectedPhotosForAlbum.some(item => item.photoId === action.payload.photoId)) {
                state.selectedPhotosForAlbum = [...state.selectedPhotosForAlbum, action.payload];
            }
        },
        removeFromAlbum(state, action) {
            state.selectedPhotosForAlbum = state.selectedPhotosForAlbum.filter(id => id.photoId !== action.payload)
        },
        resetSelectedPhotosForAlbum(state) {
            state.selectedPhotosForAlbum = [];
        },
        updateAlbumList(state, action) {
            state.userAlbumsList = [...action.payload]
        }
    }
});

export const { addToAlbum, removeFromAlbum, updateAlbumList, resetSelectedPhotosForAlbum } = albumSlice.actions;

export default albumSlice.reducer;
