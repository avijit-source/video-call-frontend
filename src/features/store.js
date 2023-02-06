import { configureStore } from '@reduxjs/toolkit'
import roomReducer from "./slice/roomSlice"
export const store = configureStore({
    reducer: {
        room: roomReducer,
    },
})