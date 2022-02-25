import { fireEvent, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { GetCitiesRequestSeeder, render } from './test-utils'
import { Home } from './Home'

describe('<Home /> component', () => {
  it('renders the search box input', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    const input = screen.getByRole('searchbox')
    expect(input).toBeInTheDocument()
  })

  it('renders the search button', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    const searchButton = screen.getByRole('button')
    expect(searchButton).toBeInTheDocument()
  })

  it('when no search has occurred then cities is not rendered', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    expect(screen.queryByTestId('cities')).not.toBeInTheDocument()
  })

  it('when search fails it renders the error text', async () => {
    var citiesMock = new GetCitiesRequestSeeder().RespondsWithError()

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    const searchButton = screen.getByRole('button')
    fireEvent(
      searchButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    const error = screen.getByText('Error!')
    expect(error).toBeInTheDocument()
  })

  it('while loading after search button clicked it renders <Cities /> component in loading state', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    const searchButton = screen.getByRole('button')
    fireEvent(
      searchButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    expect(screen.getByTestId('cities-loading')).toBeInTheDocument()
  })

  it('when search returns data it renders the <Cities /> component', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithCities()

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    const searchButton = screen.getByRole('button')
    fireEvent(
      searchButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    expect(screen.getByTestId('cities')).toBeInTheDocument()
  })

  it('when search returns data with filter it renders the <Cities /> component', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithCities('London', [
      {
        id: 1,
        name: 'London',
        country: 'United Kingdom',
        visited: false,
        wishlist: false,
      },
    ])

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    const searchBox = screen.getByRole('searchbox')
    fireEvent.change(searchBox, { target: { value: 'London' } })

    const searchButton = screen.getByRole('button')
    fireEvent(
      searchButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    expect(screen.getByTestId('cities')).toBeInTheDocument()
  })

  it('when search returns empty result due to filter not matching it renders the <Cities /> component', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithCities('Utopia', [])

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    const searchBox = screen.getByRole('searchbox')
    fireEvent.change(searchBox, { target: { value: 'Utopia' } })

    const searchButton = screen.getByRole('button')
    fireEvent(
      searchButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    expect(screen.getByTestId('cities')).toBeInTheDocument()
  })
})
