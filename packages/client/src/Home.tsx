import { FC, useState } from 'react'
import { Container, InputRightElement, Input, Heading, InputGroup, IconButton, VStack } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { Cities } from './Cities/Cities'
import { CITIES, CitiesData, CitiesVars } from './queries'
import { useLazyQuery, useQuery } from '@apollo/client'

export const Home: FC = () => {
  const [getCities, { loading, error, data }] = useLazyQuery<CitiesData, CitiesVars>(CITIES)

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

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error!</p>
  }

  return (
    <VStack spacing="8">
      <Heading as="h1">Smart traveller</Heading>
      <Container maxW="container.md">
        <InputGroup>
          <Input type="search" onChange={handleChange} />
          <InputRightElement children={<IconButton aria-label="" icon={<Search2Icon />} onClick={handleSearch} />} />
        </InputGroup>

        {data != undefined && <Cities cities={data.cities.cities} filter={filter} />}
      </Container>
    </VStack>
  )
}
