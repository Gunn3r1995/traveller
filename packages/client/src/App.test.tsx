import { BrowserRouter } from 'react-router-dom'
import { screen } from '@testing-library/react'
import { render } from './test-utils'
import { App } from './App'
import { MockedProvider } from '@apollo/client/testing'

describe('<App /> component', () => {
  it('renders the Header content', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MockedProvider>
    )

    await new Promise(resolve => setTimeout(resolve, 0)) // wait for response

    const HeadingComponent = screen.getByText(/^Smart traveller$/i)
    expect(HeadingComponent).toBeInTheDocument()
  })
})
