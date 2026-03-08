import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/users.js'

export const initializeUsers = createAsyncThunk('users/fetchAll', async () => {
  const users = await userService.getAll()
  return users
})

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeUsers.fulfilled, (state, action) => action.payload)
  },
})

export default usersSlice.reducer
