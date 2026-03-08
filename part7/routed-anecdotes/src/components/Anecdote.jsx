import { useParams } from 'react-router-dom'

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => String(a.id) === id)

  if (!anecdote) {
    return <p>Anecdote not found.</p>
  }

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>
        for more info see{' '}
        <a href={anecdote.info} target="_blank" rel="noreferrer">
          {anecdote.info}
        </a>
      </div>
      <div>by {anecdote.author}</div>
    </div>
  )
}

export default Anecdote

