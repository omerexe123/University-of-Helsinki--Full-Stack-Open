import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import personService from './services/persons'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import PersonForm from './components/PersonForm'
import Togglable from './components/Togglable'
import Person from './components/Person'
import {
  initializePersons,
  createPerson,
  removePerson,
} from './reducers/personReducer'
import { useNotificationValue, useNotify } from './contexts/NotificationContext.jsx'

const Notification = () => {
  const { message, type } = useNotificationValue()
  if (!message) return null
  return <div className={type}>{message}</div>
}

const App = () => {
  const dispatch = useDispatch()
  const notify = useNotify()
  const persons = useSelector(state => state.persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhonebookUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const personFormRef = useRef()

  useEffect(() => {
    dispatch(initializePersons())
  }, [dispatch])

  useEffect(() => {
    personService.setToken(user?.token ?? null)
  }, [user])

  const addPerson = async (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    try {
      const { isUpdate } = await dispatch(createPerson(personObject))
      notify(
        isUpdate
          ? `Updated ${newName}'s number`
          : `Added ${newName}`,
        'success',
        5,
      )
      setNewName('')
      setNewNumber('')
      personFormRef.current?.toggleVisibility()
    } catch {
      notify(`Failed to save ${newName}`, 'error', 5)
    }
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await dispatch(removePerson(id))
        notify(`Deleted ${name}`, 'success', 5)
      } catch {
        notify(`Failed to delete ${name}`, 'error', 5)
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedPhonebookUser', JSON.stringify(loggedInUser))
      personService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      setUsername('')
      setPassword('')
      notify(`Logged in as ${loggedInUser.name ?? loggedInUser.username}`, 'success', 5)
    } catch {
      notify('Wrong username or password', 'error', 5)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedPhonebookUser')
    setUser(null)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification />

      {user === null ? (
        <>
          <h3>Log in</h3>
          <LoginForm
            username={username}
            password={password}
            onUsernameChange={(e) => setUsername(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleLogin}
          />
        </>
      ) : (
        <>
          <div>
            {user.name ?? user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </div>

          <div>
            filter shown with:{' '}
            <input value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>

          <h3>Add a new</h3>
          <Togglable buttonLabel="new person" ref={personFormRef}>
            <PersonForm
              onSubmit={addPerson}
              newName={newName}
              newNumber={newNumber}
              onNameChange={(e) => setNewName(e.target.value)}
              onNumberChange={(e) => setNewNumber(e.target.value)}
            />
          </Togglable>

          <h3>Numbers</h3>
          {personsToShow.map(person => (
            <Person
              key={person.id}
              person={person}
              onDelete={() => handleDelete(person.id, person.name)}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App