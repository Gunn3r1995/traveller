import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react'
import { CityResponse } from './queries'
import { UpdateCityRequestSeeder } from './test-utils'
import { Cities } from './Cities'

describe('<Cities /> component', () => {
  it('when no cities with filter, No cities found text with filter is rendered', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities cities={[]} filter="Utopia" />
      </MockedProvider>
    )

    const noCitiesFound = screen.getByText("No cities have been found matching filter 'Utopia'")
    expect(noCitiesFound).toBeInTheDocument()
  })

  it('when no cities and no filer, No cities found text is rendered', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities cities={[]} />
      </MockedProvider>
    )

    const noCitiesFound = screen.getByText('No cities have been found')
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

  it('When cities and isReadOnly, cities table is rendered with expected cities and no edit visited/wishlist buttons', () => {
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
          isReadonly={true}
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

    const menuButton = screen.queryByRole('button')
    expect(menuButton).not.toBeInTheDocument()
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

  it('when isLoading renders skeleton', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities cities={[]} isLoading={true} />
      </MockedProvider>
    )

    expect(screen.getByTestId('cities-loading')).toBeInTheDocument()
  })

  it('does not show paging options when paging is undefined', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities cities={[]} />
      </MockedProvider>
    )

    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  })

  it('shows paging options when paging is set', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities cities={[]} pagination={{ onNextClicked: () => {}, onPreviousClicked: () => {} }} />
      </MockedProvider>
    )

    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('handles next callback when next paging options is clicked', async () => {
    const nextCallback = jest.fn()
    const previousCallback = jest.fn()

    const lnd: CityResponse = { id: 0, country: 'UK', name: 'London', visited: false, wishlist: false }

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities
          cities={[lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd]} // Needs 10 or more for button to not be disabled
          pagination={{ onNextClicked: nextCallback, onPreviousClicked: previousCallback }}
        />
      </MockedProvider>
    )

    const nextButton = screen.getByRole('button', { name: 'Next' })
    fireEvent(
      nextButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    expect(nextCallback).toHaveBeenCalledTimes(1)
    expect(previousCallback).not.toHaveBeenCalled()
  })

  it('handles previous callback when next paging options is clicked', async () => {
    const nextCallback = jest.fn()
    const previousCallback = jest.fn()
    const lnd: CityResponse = { id: 0, country: 'UK', name: 'London', visited: false, wishlist: false }

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities
          cities={[lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd]} // Needs 10 or more for button to not be disabled
          pagination={{ onNextClicked: nextCallback, onPreviousClicked: previousCallback }}
        />
      </MockedProvider>
    )

    const previousButton = screen.getByRole('button', { name: 'Previous' })
    fireEvent(
      previousButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    expect(nextCallback).not.toHaveBeenCalled()
    expect(previousCallback).toHaveBeenCalledTimes(1)
  })

  it('callbacks never fire when 9 or less cities are provided', async () => {
    const nextCallback = jest.fn()
    const previousCallback = jest.fn()
    const lnd: CityResponse = { id: 0, country: 'UK', name: 'London', visited: false, wishlist: false }

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Cities
          cities={[lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd, lnd]} // 9 cities so the button is disabled
          pagination={{ onNextClicked: nextCallback, onPreviousClicked: previousCallback }}
        />
      </MockedProvider>
    )

    const previousButton = screen.getByRole('button', { name: 'Previous' })
    fireEvent(
      previousButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    const nextButton = screen.getByRole('button', { name: 'Next' })
    fireEvent(
      nextButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )

    expect(nextCallback).not.toHaveBeenCalled()
    expect(previousCallback).not.toHaveBeenCalled()
  })
})
