import { configureStore, createSlice } from "@reduxjs/toolkit";
import { User } from "../types";

const initialState = {
    user: {
    } as User,
}

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        updateUser(state, payload) {
            state.user = payload.payload;
        },
    }
})

export const {updateUser} = globalSlice.actions;

export const store = configureStore({
    reducer: globalSlice.reducer 
})

export type RootStore = ReturnType<typeof store.getState>;

