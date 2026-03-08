import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const PersonForm = ({ onSubmit, nameField, numberField }) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="personName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          name="name"
          {...nameField}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="personNumber">
        <Form.Label>Number</Form.Label>
        <Form.Control
          name="number"
          {...numberField}
        />
      </Form.Group>
      <Button variant="success" type="submit">
        Add
      </Button>
    </Form>
  )
}

export default PersonForm

