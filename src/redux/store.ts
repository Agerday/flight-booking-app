import {configureStore} from "@reduxjs/toolkit";
import bookingReducer from "./slices/bookingSlice";

export const store = configureStore({
    reducer: {
        booking: bookingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;