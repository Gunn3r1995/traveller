import { useMutation } from '@apollo/client'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import type { FC } from 'react'
import type { CitiesMutationInput, CityResponse } from './queries'
import { CITIES_LIMIT, UPDATE_CITY } from './queries'

export interface Paging {
  onPreviousClicked: () => void
  onNextClicked: () => void
}

export interface Props {
  /**
   * The cities to render, if null supplied then the Cities table is not rendered.
   */
  cities: ReadonlyArray<CityResponse> | undefined

  /**
   * The filter text that was used to display return the supplied cities.
   */
  filter?: string

  /**
   * Whether the cities component is loading or not. If not it will render Skeletons, otherwise the provided cities.
   * @default false
   */
  isLoading?: boolean

  /**
   * Whether the user can update visited or wishlist for each city.
   * @default false
   */
  isReadonly?: boolean

  /**
   * Whether to implement paging buttons with callbacks or not.
   */
  pagination?: Paging | undefined
}

export const Cities: FC<Props> = (props: Props) => {
  const [updateCity] = useMutation<CityResponse, CitiesMutationInput>(UPDATE_CITY)
  const isLoading = props.isLoading == undefined ? false : props.isLoading
  const isReadonly = props.isReadonly == undefined ? false : props.isReadonly

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

  if (isLoading) {
    return (
      <Stack mt="10px" data-testid="cities-loading">
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    )
  }

  if (props.cities == undefined) {
    return <></> // Nothing to show, this is the initial state
  }

  return (
    <Table data-testid="cities" variant="simple">
      {props.cities.length === 0 && (
        <TableCaption>
          No cities have been found {props.filter == undefined ? '' : `matching filter '${props.filter}'`}
        </TableCaption>
      )}
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Country</Th>
          {!isReadonly && <Th></Th>}
        </Tr>
      </Thead>
      <Tbody>
        {props.cities.map(city => (
          <Tr key={city.id}>
            <Td>{city.name}</Td>
            <Td>{city.country}</Td>
            {!isReadonly && (
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
            )}
          </Tr>
        ))}
      </Tbody>
      {props.pagination != undefined && (
        <Tfoot>
          <Tr>
            <Th>
              <Button
                leftIcon={<ChevronLeftIcon />}
                onClick={props.pagination.onPreviousClicked}
                disabled={props.cities.length < CITIES_LIMIT}
              >
                Previous
              </Button>
            </Th>
            <Th></Th>
            <Th>
              <Button
                rightIcon={<ChevronRightIcon />}
                onClick={props.pagination.onNextClicked}
                disabled={props.cities.length < CITIES_LIMIT}
              >
                Next
              </Button>
            </Th>
          </Tr>
        </Tfoot>
      )}
    </Table>
  )
}
