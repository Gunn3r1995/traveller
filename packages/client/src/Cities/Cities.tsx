import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { FC } from 'react'
import { CityResponse } from '../queries'

export interface Props {
  cities: ReadonlyArray<CityResponse>
}

export const Cities: FC<Props> = (props: Props) => {
  return (
    <Table data-testid="cities" variant="simple">
      {props.cities.length === 0 && <TableCaption>No cities have been found</TableCaption>}
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Country</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.cities.map(city => (
          <Tr>
            <Td>{city.name}</Td>
            <Td>{city.country}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
