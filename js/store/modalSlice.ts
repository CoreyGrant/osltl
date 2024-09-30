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
            state.current = undefined;
        }
    }
});

export const {
    openModal,
    closeModal
} = modalSlice.actions;