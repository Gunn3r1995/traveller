import { useState } from 'react'
import type { FC } from 'react'
import { Container, InputRightElement, Input, Heading, InputGroup, IconButton, VStack } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { Cities } from './Cities'
import type { CitiesData, CitiesVars } from './queries'
import { CITIES, CITIES_LIMIT } from './queries'
import { useLazyQuery } from '@apollo/client'
import type { ChangeEvent } from 'react'

export const Home: FC = () => {
  const [offset, setOffset] = useState<number>(0)
  const [getCities, { loading, error, data, refetch }] = useLazyQuery<CitiesData, CitiesVars>(CITIES)

  const [filter, setFilter] = useState<string>()
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value)

  const handleSearch = () =>
    getCities({
      variables: {
        filter: {
          name: filter,
        },
        limit: CITIES_LIMIT,
        offset: 0,
      },
    })

  const handlePrevious = () => {
    if (offset === 0) {
      return // We have reached the first page. No more paging required
    }

    const newOffset = offset - CITIES_LIMIT
    setOffset(newOffset)
    refetch({
      filter: {
        name: filter,
      },
      limit: CITIES_LIMIT,
      offset: newOffset,
    })
  }

  const handleNext = () => {
    const newOffset = offset + CITIES_LIMIT
    setOffset(newOffset)
    refetch({
      filter: {
        name: filter,
      },
      limit: CITIES_LIMIT,
      offset: newOffset,
    })
  }

  return (
    <VStack spacing="8">
      <Heading as="h1">Smart traveller</Heading>
      <Container maxW="container.md">
        <InputGroup>
          <Input type="search" onChange={handleChange} />
          <InputRightElement children={<IconButton aria-label="" icon={<Search2Icon />} onClick={handleSearch} />} />
        </InputGroup>

        {error && <p>Error!</p>}
        {!error && (
          <Cities
            cities={data?.cities?.cities}
            filter={filter}
            isLoading={loading}
            pagination={{
              onPreviousClicked: handlePrevious,
              onNextClicked: handleNext,
            }}
          />
        )}
      </Container>
    </VStack>
  )
}
