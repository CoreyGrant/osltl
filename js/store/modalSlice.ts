import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        current: undefined
    },
    reducers: {
        openModal(state, action){
            state.current = action.payload;
        },
        closeModal(state){
            console.log("tried to close modal");
            state.current = undefined;
        }
    }
});

export const {
    openModal,
    closeModal
} = modalSlice.actions;