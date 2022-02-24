import { Table, TableCaption, Tbody, Td, Tfoot, Th, Thead, Tr, useId } from '@chakra-ui/react'
import { FC } from 'react'
import { City } from '../../../api/src/cities/types'

export interface Props {
  cities: ReadonlyArray<City>
}

export const Cities: FC<Props> = (props: Props) => {
  return (
    <Table data-testid="cities" variant="simple">
      <TableCaption>Imperial to metric conversion factors</TableCaption>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Country</Th>
        </Tr>
      </Thead>
      <Tbody></Tbody>
    </Table>
  )
}
