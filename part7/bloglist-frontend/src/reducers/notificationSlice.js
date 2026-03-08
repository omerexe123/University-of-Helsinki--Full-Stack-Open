import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, type: 'success' },
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return { message: null, type: 'success' }
    },
  },
})

export const { showNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const setNotification = (message, type = 'success', seconds = 5) => (dispatch) => {
  dispatch(showNotification({ message, type }))

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    dispatch(clearNotification())
  }, seconds * 1000)
}

export default notificationSlice.reducer
