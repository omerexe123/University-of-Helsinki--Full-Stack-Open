import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (!notification) return null

  const style = {
    border: 'solid 1px',
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification

