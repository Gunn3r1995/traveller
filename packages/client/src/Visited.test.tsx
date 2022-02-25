import { screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { GetCitiesRequestSeeder, render } from './test-utils'
import { Home } from './Home'
import { Visited } from './Visited'

describe('<Visited /> component', () => {
  it('renders the error text when fails to load visited cities', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithError()

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Visited />
      </MockedProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    const error = screen.getByText('Error getting your visited cities')
    expect(error).toBeInTheDocument()
  })

  it('renders the <Cities /> component as cities-loading when visited cities query has responded', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithVisitedCities(true, [
      {
        id: 1,
        name: 'London',
        country: 'United Kingdom',
        visited: true,
        wishlist: false,
      },
    ])

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Visited />
      </MockedProvider>
    )

    expect(screen.getByTestId('cities-loading')).toBeInTheDocument()
  })

  it('renders the <Cities /> component when visited cities query has responded', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithVisitedCities(true, [
      {
        id: 1,
        name: 'London',
        country: 'United Kingdom',
        visited: true,
        wishlist: false,
      },
    ])

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Visited />
      </MockedProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    expect(screen.getByTestId('cities')).toBeInTheDocument()
  })
})
