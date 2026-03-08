import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

const Person = ({ person, onDelete }) => {
  return (
    <tr>
      <td>
        <Link to={`/persons/${person.id}`}>{person.name}</Link>
      </td>
      <td>{person.number}</td>
      <td>
        <Button variant="outline-danger" size="sm" onClick={onDelete}>
          delete
        </Button>
      </td>
    </tr>
  )
}

export default Person

