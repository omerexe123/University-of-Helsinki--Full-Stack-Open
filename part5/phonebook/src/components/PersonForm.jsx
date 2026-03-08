const PersonForm = ({
  onSubmit,
  newName,
  newNumber,
  onNameChange,
  onNumberChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:{' '}
        <input
          name="name"
          value={newName}
          onChange={onNameChange}
        />
      </div>
      <div>
        number:{' '}
        <input
          name="number"
          value={newNumber}
          onChange={onNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm

