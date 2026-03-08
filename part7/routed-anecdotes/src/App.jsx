import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Menu from './components/Menu.jsx'
import AnecdoteList from './components/AnecdoteList.jsx'
import Anecdote from './components/Anecdote.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'
import CreateNew from './components/CreateNew.jsx'
import Notification from './components/Notification.jsx'

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ])
  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification message={notification} />

      <Routes>
        <Route
          path="/"
          element={<AnecdoteList anecdotes={anecdotes} />}
        />
        <Route
          path="/create"
          element={(
            <CreateNew
              addNew={addNew}
              setNotification={setNotification}
            />
          )}
        />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/anecdotes/:id"
          element={<Anecdote anecdotes={anecdotes} />}
        />
      </Routes>

      <Footer />
    </div>
  )
}

export default App

