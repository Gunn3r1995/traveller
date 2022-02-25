import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react'
import { UpdateCityRequestSeeder } from '../test-utils'
import { Cities } from './Cities'

describe('<Home /> component', () => {
  it('when no cities, No cities found text is rendered', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities cities={[]} filter="Utopia" />
      </MockedProvider>
    )

    const noCitiesFound = screen.getByText("No cities have been found matching filter 'Utopia'")
    expect(noCitiesFound).toBeInTheDocument()
  })

  it('when cities, cities table is rendered with expected cities', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities
          cities={[
            {
              id: 1,
              name: 'London',
              country: 'United Kingdom',
              visited: false,
              wishlist: false,
            },
            {
              id: 2,
              name: 'Moscow',
              country: 'Russia',
              visited: false,
              wishlist: false,
            },
          ]}
          filter={'o'}
        />
      </MockedProvider>
    )

    const london = screen.getByText('London')
    const uk = screen.getByText('United Kingdom')
    expect(london).toBeInTheDocument()
    expect(uk).toBeInTheDocument()

    const moscow = screen.getByText('Moscow')
    const russia = screen.getByText('Russia')
    expect(moscow).toBeInTheDocument()
    expect(russia).toBeInTheDocument()
  })

  it('with cities the menu button is rendered', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities
          cities={[
            {
              id: 1,
              name: 'London',
              country: 'United Kingdom',
              visited: false,
              wishlist: false,
            },
          ]}
          filter={'London'}
        />
      </MockedProvider>
    )

    const menuButton = screen.getByRole('button')
    expect(menuButton).toBeInTheDocument()
  })

  it('when city has not been visited or wish-listed, the visit/wishlist menu items are rendered', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities
          cities={[
            {
              id: 1,
              name: 'London',
              country: 'United Kingdom',
              visited: false,
              wishlist: false,
            },
          ]}
          filter={'London'}
        />
      </MockedProvider>
    )

    const visited = screen.getByText('Set visited')
    expect(visited).toBeInTheDocument()

    const wishlist = screen.getByText('Add to wishlist')
    expect(wishlist).toBeInTheDocument()
  })

  it('when city has been visited or wish-listed, the un-visit/remove-wishlist menu items are rendered', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities
          cities={[
            {
              id: 1,
              name: 'London',
              country: 'United Kingdom',
              visited: true,
              wishlist: true,
            },
          ]}
          filter={'London'}
        />
      </MockedProvider>
    )

    const visited = screen.getByText('Set not visited')
    expect(visited).toBeInTheDocument()

    const wishlist = screen.getByText('Remove from wishlist')
    expect(wishlist).toBeInTheDocument()
  })

  it('when visited menu item has been clicked, calls mutation', async () => {
    const citiesMock = new UpdateCityRequestSeeder().UpdateVisited(true)

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Cities
          cities={[
            {
              id: 1,
              name: 'London',
              country: 'United Kingdom',
              visited: false,
              wishlist: false,
            },
          ]}
          filter={'London'}
        />
      </MockedProvider>
    )

    const visitedButton = screen.getByText('Set visited')
    fireEvent(
      visitedButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response
  })

  it('when wishlist menu item has been clicked, calls mutation', async () => {
    const citiesMock = new UpdateCityRequestSeeder().UpdateWishlist(true)

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Cities
          cities={[
            {
              id: 1,
              name: 'London',
              country: 'United Kingdom',
              visited: false,
              wishlist: false,
            },
          ]}
          filter={'London'}
        />
      </MockedProvider>
    )

    const wishlistButton = screen.getByText('Add to wishlist')
    fireEvent(
      wishlistButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response
  })
})
