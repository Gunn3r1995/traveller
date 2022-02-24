import { render, screen } from '@testing-library/react'
import { Cities } from './Cities'

describe('<Home /> component', () => {
  it('when no cities, No cities found text is rendered', async () => {
    render(<Cities cities={[]} filter="Utopia" />)

    const noCitiesFound = screen.getByText("No cities have been found matching filter 'Utopia'")
    expect(noCitiesFound).toBeInTheDocument()
  })

  it('when cities, cities table is rendered with expected cities', async () => {
    render(
      <Cities
        cities={[
          {
            id: 1,
            name: 'London',
            country: 'United Kingdom',
          },
          {
            id: 2,
            name: 'Moscow',
            country: 'Russia',
          },
        ]}
        filter={'o'}
      />
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
})
