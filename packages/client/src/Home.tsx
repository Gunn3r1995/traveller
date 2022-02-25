import { FC, useState } from 'react'
import { Container, InputRightElement, Input, Heading, InputGroup, IconButton, VStack } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { Cities } from './Cities/Cities'
import { CITIES, CitiesData, CitiesVars } from './queries'
import { useLazyQuery } from '@apollo/client'

export const Home: FC = () => {
  const [offset, setOffset] = useState(0)
  const [getCities, { loading, error, data, refetch }] = useLazyQuery<CitiesData, CitiesVars>(CITIES)

  const [filter, setFilter] = useState<string>()
  const handleChange = (event: any) => setFilter(event.target.value)

  const handleSearch = () =>
    getCities({
      variables: {
        filter: {
          name: filter,
        },
        limit: 10,
        offset: 0,
      },
    })

  const handlePrevious = () => {
    if (offset === 0) {
      return
    }

    const newOffset = offset - 10
    setOffset(newOffset)
    refetch({
      filter: {
        name: filter,
      },
      limit: 10,
      offset: newOffset,
    })
  }

  const handleNext = () => {
    const newOffset = offset + 10
    setOffset(newOffset)
    refetch({
      filter: {
        name: filter,
      },
      limit: 10,
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
