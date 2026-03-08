import { createContext, useContext, useReducer } from 'react'

const NotificationStateContext = createContext()
const NotificationDispatchContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {
        message: action.payload.message,
        type: action.payload.type,
      }
    case 'CLEAR':
      return {
        message: null,
        type: null,
      }
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    message: null,
    type: null,
  })

  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationStateContext)
  if (context === undefined) {
    throw new Error('useNotificationValue must be used within a NotificationContextProvider')
  }
  return context
}

export const useNotificationDispatch = () => {
  const context = useContext(NotificationDispatchContext)
  if (context === undefined) {
    throw new Error('useNotificationDispatch must be used within a NotificationContextProvider')
  }
  return context
}

export const useNotify = () => {
  const dispatch = useNotificationDispatch()

  return (message, type = 'success', timeInSeconds = 5) => {
    dispatch({ type: 'SET', payload: { message, type } })

    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, timeInSeconds * 1000)
  }
}

