import { screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { GetCitiesRequestSeeder, render } from './test-utils'
import { WishList } from './WishList'

describe('<WishList /> component', () => {
  it('renders the error text when fails to load wishlist cities', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithError()

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <WishList />
      </MockedProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    const error = screen.getByText('Error getting your wishlist cities')
    expect(error).toBeInTheDocument()
  })

  it('renders the <Cities /> component as cities-loading when wishlist cities query has responded', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithWishlistCities(true, [
      {
        id: 1,
        name: 'London',
        country: 'United Kingdom',
        visited: false,
        wishlist: true,
      },
    ])

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <WishList />
      </MockedProvider>
    )

    expect(screen.getByTestId('cities-loading')).toBeInTheDocument()
  })

  it('renders the <Cities /> component when wishlist cities query has responded', async () => {
    const citiesMock = new GetCitiesRequestSeeder().RespondsWithWishlistCities(true, [
      {
        id: 1,
        name: 'London',
        country: 'United Kingdom',
        visited: false,
        wishlist: true,
      },
    ])

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <WishList />
      </MockedProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    expect(screen.getByTestId('cities')).toBeInTheDocument()
  })
})
