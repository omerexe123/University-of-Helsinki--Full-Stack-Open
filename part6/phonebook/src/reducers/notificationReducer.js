import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
  },
})

export const { setNotification } = notificationSlice.actions

let timeoutId

export const notify = (message, timeInSeconds) => dispatch => {
  dispatch(setNotification(message))

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    dispatch(setNotification(null))
  }, timeInSeconds * 1000)
}

export default notificationSlice.reducer

