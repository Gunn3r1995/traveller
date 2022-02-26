import { fireEvent, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { GetCitiesRequestSeeder, render } from './test-utils'
import { Home } from './Home'
import { CITIES_LIMIT, CityResponse } from './queries'

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

  it('fetches with new offset when next button is clicked and then previous button is clicked', async () => {
    const lnd: CityResponse = { id: 0, country: 'UK', name: 'London', visited: false, wishlist: false }
    const mos: CityResponse = { id: 1, country: 'Russia', name: 'Moscow', visited: false, wishlist: false }
    const stPeter: CityResponse = {
      id: 2,
      country: 'Russia',
      name: 'Saint Petersburg',
      visited: false,
      wishlist: false,
    }

    const citiesMockOffset0 = new GetCitiesRequestSeeder().RespondsWithCities(
      undefined,
      [lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd],
      0
    )
    const citiesMockOffset10 = new GetCitiesRequestSeeder().RespondsWithCities(
      undefined,
      [mos, mos, mos, mos, mos, mos, mos, mos, mos, mos],
      CITIES_LIMIT
    )
    const citiesMockOffsetPrev0 = new GetCitiesRequestSeeder().RespondsWithCities(
      undefined,
      [stPeter, stPeter, stPeter, stPeter, stPeter, stPeter, stPeter, stPeter, stPeter, stPeter],
      0
    )

    render(
      <MockedProvider mocks={[citiesMockOffset0, citiesMockOffset10, citiesMockOffsetPrev0]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    // Initial Search
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
    expect(screen.getAllByText('London')).toHaveLength(CITIES_LIMIT)

    // Next Button Clicked Once

    const nextButton = screen.getByRole('button', { name: 'Next' })
    fireEvent(
      nextButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response
    expect(screen.getByTestId('cities')).toBeInTheDocument()
    expect(screen.getAllByText('Moscow')).toHaveLength(CITIES_LIMIT)

    // Previous Button Clicked Once

    const previousButton = screen.getByRole('button', { name: 'Previous' })
    fireEvent(
      previousButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response
    expect(screen.getByTestId('cities')).toBeInTheDocument()
    expect(screen.getAllByText('Saint Petersburg')).toHaveLength(CITIES_LIMIT)

    // Clicking Previous Button again does nothing
    fireEvent(
      previousButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response
    expect(screen.getByTestId('cities')).toBeInTheDocument()
    expect(screen.getAllByText('Saint Petersburg')).toHaveLength(CITIES_LIMIT)
  })
})
