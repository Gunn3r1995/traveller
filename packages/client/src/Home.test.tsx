import { screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { render } from './test-utils'
import { Home } from './Home'
import { CITIES } from './queries'
import { GraphQLError } from 'graphql'

describe('<Home /> component', () => {
  it('renders the Smart traveller header', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    const HeadingComponent = screen.getByText(/^Smart traveller$/i)
    expect(HeadingComponent).toBeInTheDocument()
  })

  it('when no cities, the <Cities /> component is not rendered', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    )
    expect(screen.queryByTestId('cities')).toBeNull()
  })

  it('when still loading it displays the loading text', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    const loading = screen.getByText('Loading...')
    expect(loading).toBeInTheDocument()
  })

  it('when load fails it displays the error text', async () => {
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

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    const error = screen.getByText('Error!')
    expect(error).toBeInTheDocument()
  })

  it('loads and displays the <Cities /> component', async () => {
    const citiesMock = {
      request: {
        query: CITIES,
      },
      result: {
        data: { cities: { id: 1, name: 'London', country: 'United Kingdom' } },
      },
    }

    render(
      <MockedProvider mocks={[citiesMock]} addTypename={false}>
        <Home />
      </MockedProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    expect(screen.getByTestId('cities')).toBeInTheDocument()
  })
})
