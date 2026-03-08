import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import blogService from '../services/blogs.js'

export const initializeBlogs = createAsyncThunk('blogs/fetchAll', async () => {
  const blogs = await blogService.getAll()
  return blogs
})

export const createBlog = createAsyncThunk('blogs/create', async (blog) => {
  const created = await blogService.create(blog)
  return created
})

export const likeBlog = createAsyncThunk('blogs/like', async (blog) => {
  const updated = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
  return updated
})

export const deleteBlog = createAsyncThunk('blogs/delete', async (blog) => {
  await blogService.remove(blog.id)
  return blog.id
})

export const addComment = createAsyncThunk('blogs/comment', async ({ id, comment }) => {
  const updated = await blogService.addComment(id, comment)
  return updated
})

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeBlogs.fulfilled, (state, action) => {
        return action.payload.sort((a, b) => b.likes - a.likes)
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const updated = action.payload
        return state
          .map((b) => (b.id !== updated.id ? b : updated))
          .sort((a, b) => b.likes - a.likes)
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const id = action.payload
        return state.filter((b) => b.id !== id)
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updated = action.payload
        return state.map((b) => (b.id !== updated.id ? b : updated))
      })
  },
})

export default blogsSlice.reducer
