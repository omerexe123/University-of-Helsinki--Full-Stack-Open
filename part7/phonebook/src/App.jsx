import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
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
import { useField } from './hooks'

const Notification = () => {
  const { message, type } = useNotificationValue()
  if (!message) return null

  const variant = type === 'error' ? 'danger' : 'success'

  return (
    <Alert variant={variant} className="mt-3">
      {message}
    </Alert>
  )
}

const Navigation = () => (
  <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
    <Container>
      <Navbar.Brand as={Link} to="/">
        Phonebook
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="phonebook-navbar" />
      <Navbar.Collapse id="phonebook-navbar">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/users">
            Users
          </Nav.Link>
          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
)

const UsersView = ({ persons }) => {
  const stats = persons.reduce((acc, person) => {
    const user = person.user ?? {}
    const id = user.id ?? user.username ?? 'unknown'
    const name = user.name ?? user.username ?? 'Unknown'

    if (!acc[id]) {
      acc[id] = { id, name, count: 0 }
    }
    acc[id].count += 1
    return acc
  }, {})

  const users = Object.values(stats)

  return (
    <div>
      <h3>Users</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Entries created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const PersonDetail = ({ persons }) => {
  const { id } = useParams()
  const person = persons.find(p => String(p.id) === id)

  if (!person) {
    return <div>Person not found.</div>
  }

  return (
    <div>
      <h3>{person.name}</h3>
      <p>Number: {person.number}</p>
      {person.user && (
        <p>
          Added by: {person.user.name ?? person.user.username ?? 'Unknown'}
        </p>
      )}
    </div>
  )
}

const About = () => (
  <div>
    <h3>About</h3>
    <p>This is a simple phonebook application built with React, Redux, and React Router.</p>
  </div>
)

const App = () => {
  const dispatch = useDispatch()
  const notify = useNotify()
  const persons = useSelector(state => state.persons)
  const nameField = useField('text')
  const numberField = useField('text')
  const [filter, setFilter] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhonebookUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })
  const usernameField = useField('text')
  const passwordField = useField('password')
  const personFormRef = useRef()

  useEffect(() => {
    dispatch(initializePersons())
  }, [dispatch])

  useEffect(() => {
    personService.setToken(user?.token ?? null)
  }, [user])

  const addPerson = async (event) => {
    event.preventDefault()
    const personObject = { name: nameField.value, number: numberField.value }
    try {
      const { isUpdate } = await dispatch(createPerson(personObject))
      notify(
        isUpdate
          ? `Updated ${nameField.value}'s number`
          : `Added ${nameField.value}`,
        'success',
        5,
      )
      nameField.reset()
      numberField.reset()
      personFormRef.current?.toggleVisibility()
    } catch {
      notify(`Failed to save ${nameField.value}`, 'error', 5)
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
      const loggedInUser = await loginService.login({
        username: usernameField.value,
        password: passwordField.value,
      })
      window.localStorage.setItem('loggedPhonebookUser', JSON.stringify(loggedInUser))
      personService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      usernameField.reset()
      passwordField.reset()
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

  const loginSection = (
    <>
      <h3>Log in</h3>
      <LoginForm
        username={((({ reset, ...rest }) => rest)(usernameField))}
        password={((({ reset, ...rest }) => rest)(passwordField))}
        onSubmit={handleLogin}
      />
    </>
  )

  const phonebookSection = (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          {user?.name ?? user?.username ?? 'Guest'}
        </div>
        {user && (
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            logout
          </button>
        )}
      </div>

      <Form className="mb-3">
        <Form.Group controlId="filterInput">
          <Form.Label>Filter shown with</Form.Label>
          <Form.Control
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name"
          />
        </Form.Group>
      </Form>

      <h3>Add a new</h3>
      <Togglable buttonLabel="new person" ref={personFormRef}>
        <PersonForm
          onSubmit={addPerson}
          nameField={((({ reset, ...rest }) => rest)(nameField))}
          numberField={((({ reset, ...rest }) => rest)(numberField))}
        />
      </Togglable>

      <h3 className="mt-4">Numbers</h3>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {personsToShow.map(person => (
            <Person
              key={person.id}
              person={person}
              onDelete={() => handleDelete(person.id, person.name)}
            />
          ))}
        </tbody>
      </Table>
    </>
  )

  return (
    <Router>
      <Navigation />
      <Container className="mt-3">
        <Notification />

        <Routes>
          <Route
            path="/"
            element={user ? phonebookSection : loginSection}
          />
          <Route
            path="/login"
            element={loginSection}
          />
          <Route
            path="/users"
            element={user ? <UsersView persons={persons} /> : loginSection}
          />
          <Route
            path="/persons/:id"
            element={<PersonDetail persons={persons} />}
          />
          <Route
            path="/about"
            element={<About />}
          />
        </Routes>
      </Container>
    </Router>
  )
}

export default App