import { createSlice } from '@reduxjs/toolkit'
import personService from '../services/persons'

const personSlice = createSlice({
  name: 'persons',
  initialState: [],
  reducers: {
    setPersons(state, action) {
      return action.payload
    },
    addPerson(state, action) {
      state.push(action.payload)
    },
    updatePerson(state, action) {
      const updated = action.payload
      return state.map(p => (p.id !== updated.id ? p : updated))
    },
    deletePerson(state, action) {
      const id = action.payload
      return state.filter(p => p.id !== id)
    },
  },
})

export const { setPersons, addPerson, updatePerson, deletePerson } = personSlice.actions

export const initializePersons = () => async dispatch => {
  const persons = await personService.getAll()
  dispatch(setPersons(persons))
}

export const createPerson = personObject => async (dispatch, getState) => {
  const existingPerson = getState().persons.find(
    p => p.name.toLowerCase() === personObject.name.toLowerCase(),
  )

  if (existingPerson) {
    const changedPerson = { ...existingPerson, number: personObject.number }
    const updated = await personService.update(existingPerson.id, changedPerson)
    dispatch(updatePerson(updated))
    return { person: updated, isUpdate: true }
  }

  const newPerson = await personService.create(personObject)
  dispatch(addPerson(newPerson))
  return { person: newPerson, isUpdate: false }
}

export const removePerson = id => async dispatch => {
  await personService.remove(id)
  dispatch(deletePerson(id))
}

export default personSlice.reducer

