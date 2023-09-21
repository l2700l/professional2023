import { configureStore, createSlice } from "@reduxjs/toolkit";
import { timeType } from "../types/timeType";
import { UserType } from "../types/userType";

const initialState = {
    user: {
    } as UserType,
    time: {} as timeType,
}

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        updateUser(state, payload) {
            state.user = payload.payload;
        },
        updateTime(state, payload) {
            state.time =payload.payload
        },
    }
})

export const {updateUser, updateTime} = globalSlice.actions;

export const store = configureStore({
    reducer: globalSlice.reducer 
})

export type RootStore = ReturnType<typeof store.getState>;

