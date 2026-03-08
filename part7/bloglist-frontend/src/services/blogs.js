import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

export const setToken = (newToken) => {
  token = 
}

const getConfig = () => ({
  headers: { Authorization: token },
})

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(, newObject, getConfig())
  return response.data
}

const remove = async (id) => {
  await axios.delete(, getConfig())
}

const addComment = async (id, comment) => {
  const response = await axios.post(, { comment }, getConfig())
  return response.data
}

export default { getAll, create, update, remove, addComment, setToken }
