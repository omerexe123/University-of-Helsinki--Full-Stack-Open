import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PersonForm from './PersonForm'

describe('<PersonForm />', () => {
  test('calls onSubmit with correct details when new person is created', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn((event) => event.preventDefault())

    render(
      <PersonForm
        onSubmit={handleSubmit}
        newName=""
        newNumber=""
        onNameChange={() => {}}
        onNumberChange={() => {}}
      />,
    )

    const [nameInput, numberInput] = screen.getAllByRole('textbox')
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(nameInput, 'Test User')
    await user.type(numberInput, '12345')
    await user.click(addButton)

    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})

