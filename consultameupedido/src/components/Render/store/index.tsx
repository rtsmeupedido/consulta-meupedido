import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/User";
import zendeskReducer from "../features/zendesk";

export const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {},
        }),
    reducer: {
        user: userReducer,
        zendesk: zendeskReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
