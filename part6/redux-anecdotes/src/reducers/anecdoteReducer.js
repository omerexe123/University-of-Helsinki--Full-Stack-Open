import { createSlice } from '@reduxjs/toolkit'
import { getAll, createNew, updateAnecdote as updateAnecdoteOnServer } from '../services/anecdotes.js'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => (a.id !== updated.id ? a : updated))
    },
  },
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = anecdoteSlice.actions

// 6.16 initialize via async thunk
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

// 6.17 create via async thunk
export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

// 6.18 vote via async thunk (persists to backend)
export const voteAnecdote = anecdote => {
  return async dispatch => {
    const toUpdate = { ...anecdote, votes: anecdote.votes + 1 }
    const updated = await updateAnecdoteOnServer(toUpdate)
    dispatch(updateAnecdote(updated))
  }
}

export default anecdoteSlice.reducer

