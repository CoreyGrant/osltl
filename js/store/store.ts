import { configureStore } from '@reduxjs/toolkit'
import { appSlice } from './appSlice'

export const store = configureStore({
  reducer: {
    app: appSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

