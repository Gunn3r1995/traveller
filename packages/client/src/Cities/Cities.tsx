import { useMutation } from '@apollo/client'
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { FC } from 'react'
import { CitiesMutationInput, CityResponse, UPDATE_CITY } from '../queries'

export interface Props {
  filter: string | undefined
  cities: ReadonlyArray<CityResponse>
}

export const Cities: FC<Props> = (props: Props) => {
  const [updateCity] = useMutation<CityResponse, CitiesMutationInput>(UPDATE_CITY)

  const handleVisitedClicked = (id: number, visited: boolean) => {
    updateCity({
      variables: {
        input: {
          id: id,
          visited: visited,
        },
      },
    })
  }
  const handleWishlistClicked = (id: number, wishlist: boolean) => {
    updateCity({
      variables: {
        input: {
          id: id,
          wishlist: wishlist,
        },
      },
    })
  }

  return (
    <Table data-testid="cities" variant="simple">
      {props.cities.length === 0 && (
        <TableCaption>No cities have been found matching filter '{props.filter}'</TableCaption>
      )}
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Country</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.cities.map(city => (
          <Tr key={city.id}>
            <Td>{city.name}</Td>
            <Td>{city.country}</Td>
            <Td>
              <Menu>
                <MenuButton as={Button}>...</MenuButton>
                <MenuList>
                  <MenuItem
                    data-testid="visited-button"
                    onClick={() => {
                      handleVisitedClicked(city.id, !city.visited)
                    }}
                  >
                    {city.visited ? 'Set not visited' : 'Set visited'}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleWishlistClicked(city.id, !city.wishlist)
                    }}
                  >
                    {city.wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
