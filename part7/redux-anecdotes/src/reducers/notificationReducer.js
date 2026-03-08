import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'render here notification...',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    },
  },
})

export const { showNotification, clearNotification } = notificationSlice.actions

let timeoutId

// 6.19: thunk-style action creator with message + seconds
export const setNotification = (message, seconds) => dispatch => {
  dispatch(showNotification(message))

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    dispatch(clearNotification())
  }, seconds * 1000)
}

export default notificationSlice.reducer

