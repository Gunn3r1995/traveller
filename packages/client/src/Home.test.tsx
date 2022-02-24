import { screen, waitFor } from '@testing-library/react'
import { render } from './test-utils'
import { Home } from './Home'

describe('<Home /> component', () => {
  it('renders the Smart traveller header', () => {
    render(<Home />)

    const HeadingComponent = screen.getByText(/^Smart traveller$/i)
    expect(HeadingComponent).toBeInTheDocument()
  })

  it('when no cities, the <Cities /> component is not rendered', async () => {
    render(<Home />)
    expect(screen.queryByTestId('cities')).toBeNull()
  })

  it('loads and displays the <Cities /> comonent with expected cities count', async () => {
    render(<Home />)

    await waitFor(() => screen.getByTestId('cities'))

    expect(screen.getByTestId('cities')).toHaveTextContent('London')
    expect(screen.getByTestId('cities')).toHaveTextContent('Brighton')
  })
})
