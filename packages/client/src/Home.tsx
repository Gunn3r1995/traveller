import type { FC } from 'react'
import { Container, InputRightElement, Input, Heading, InputGroup, IconButton, VStack } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { Cities } from './Cities/Cities'
import { CITIES, CitiesData, CitiesVars } from './queries'
import { useQuery } from '@apollo/client'

export const Home: FC = () => {
  const { loading, error, data } = useQuery<CitiesData, CitiesVars>(CITIES)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  return (
    <VStack spacing="8">
      <Heading as="h1">Smart traveller</Heading>
      <Container maxW="container.md">
        <InputGroup>
          <Input />
          <InputRightElement children={<IconButton aria-label="" icon={<Search2Icon />} />} />
        </InputGroup>

        {data != undefined && <Cities cities={data.cities.cities} />}
      </Container>
    </VStack>
  )
}
