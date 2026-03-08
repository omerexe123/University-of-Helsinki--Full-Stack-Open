import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationSlice.js'
import blogsReducer from './reducers/blogsSlice.js'
import userReducer from './reducers/userSlice.js'
import usersReducer from './reducers/usersSlice.js'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
    users: usersReducer,
  },
})

export default store
