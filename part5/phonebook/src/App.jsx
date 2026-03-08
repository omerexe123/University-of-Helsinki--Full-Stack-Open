import { useState, useEffect, useRef } from 'react'
import personService from './services/persons'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import PersonForm from './components/PersonForm'
import Togglable from './components/Togglable'
import Person from './components/Person'

const Notification = ({ message, type }) => {
  if (message === null) return null
  return <div className={type}>{message}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhonebookUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const personFormRef = useRef()

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  useEffect(() => {
    personService.setToken(user?.token ?? null)
  }, [user])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${newName} is already added, replace the old number?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            showNotification(`Updated ${newName}'s number`, 'success')
          })
          .catch(() => {
            showNotification(`Information of ${newName} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    const personObject = { name: newName, number: newNumber }
    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      showNotification(`Added ${newName}`, 'success')
      setNewName('')
      setNewNumber('')
      personFormRef.current?.toggleVisibility()
    })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id))
        showNotification(`Deleted ${name}`, 'success')
      })
    }
  }

  const showNotification = (msg, type) => {
    setInfoMessage(msg)
    setMessageType(type)
    setTimeout(() => setInfoMessage(null), 5000)
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
      showNotification(`Logged in as ${loggedInUser.name ?? loggedInUser.username}`, 'success')
    } catch {
      showNotification('Wrong username or password', 'error')
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
      <Notification message={infoMessage} type={messageType} />

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