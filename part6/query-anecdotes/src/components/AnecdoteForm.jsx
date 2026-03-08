import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'

const AnecdoteForm = () => {
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    newAnecdoteMutation.mutate(content)
    setContent('')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <div>
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

