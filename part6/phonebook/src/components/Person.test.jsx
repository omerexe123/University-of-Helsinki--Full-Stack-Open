import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Person from './Person'

describe('<Person />', () => {
  test('renders name and number and calls delete handler once when button clicked', async () => {
    const user = userEvent.setup()
    const person = { name: 'Arto Hellas', number: '040-1234567' }
    const mockHandler = vi.fn()

    render(<Person person={person} onDelete={mockHandler} />)

    expect(screen.getByText('Arto Hellas 040-1234567', { exact: false })).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /delete/i })
    await user.click(button)

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })
})

