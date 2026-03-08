import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  test('renders its children but they are hidden by default and shown after clicking the button', async () => {
    const user = userEvent.setup()

    render(
      <Togglable buttonLabel="show">
        <div>togglable content</div>
      </Togglable>,
    )

    const button = screen.getByRole('button', { name: /show/i })
    await user.click(button)

    // children visible after click
    expect(screen.getByText('togglable content')).toBeInTheDocument()
  })
})

