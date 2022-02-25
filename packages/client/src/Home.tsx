import { FC, useState } from 'react'
import { Container, InputRightElement, Input, Heading, InputGroup, IconButton, VStack } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { Cities } from './Cities/Cities'
import { CITIES, CitiesData, CitiesVars } from './queries'
import { useLazyQuery } from '@apollo/client'

export const Home: FC = () => {
  const [getCities, { loading, error, data }] = useLazyQuery<CitiesData, CitiesVars>(CITIES)
  // TODO: Implement Show More Functionality

  const [filter, setFilter] = useState<string>()
  const handleChange = (event: any) => setFilter(event.target.value)
  const handleSearch = () =>
    getCities({
      variables: {
        filter: {
          name: filter,
        },
      },
    })

  return (
    <VStack spacing="8">
      <Heading as="h1">Smart traveller</Heading>
      <Container maxW="container.md">
        <InputGroup>
          <Input type="search" onChange={handleChange} />
          <InputRightElement children={<IconButton aria-label="" icon={<Search2Icon />} onClick={handleSearch} />} />
        </InputGroup>

        {error && <p>Error!</p>}
        {!error && <Cities cities={data?.cities?.cities} filter={filter} isLoading={loading} />}
      </Container>
    </VStack>
  )
}
