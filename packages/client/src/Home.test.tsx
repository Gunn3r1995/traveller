import { fireEvent, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { render } from './test-utils'
import { Home } from './Home'
import { CITIES } from './queries'
import { GraphQLError } from 'graphql'
import { Button } from '@chakra-ui/react'

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

  it('when loading after search button clicked it renders the loading text', async () => {
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

    const error = screen.getByText('Loading...')
    expect(error).toBeInTheDocument()
  })

  it('when search fails it renders the error text', async () => {
    const citiesMock = {
      request: {
        query: CITIES,
      },
      result: {
        errors: [new GraphQLError('Error!')],
      },
    }

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

  it('when search returns data it renders the <Cities /> component', async () => {
    const citiesMock = {
      request: {
        query: CITIES,
        variables: {
          filter: {
            name: undefined,
          },
        },
      },
      result: {
        data: {
          cities: {
            cities: [
              { id: 1, name: 'London', country: 'United Kingdom' },
              { id: 1, name: 'Moscow', country: 'Russia' },
            ],
          },
        },
      },
    }

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
    const citiesMock = {
      request: {
        query: CITIES,
        variables: {
          filter: {
            name: 'London',
          },
        },
      },
      result: {
        data: { cities: { cities: [{ id: 1, name: 'London', country: 'United Kingdom' }] } },
      },
    }

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
    const citiesMock = {
      request: {
        query: CITIES,
        variables: {
          filter: {
            name: 'Utopia',
          },
        },
      },
      result: {
        data: { cities: { cities: [] } },
      },
    }

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
