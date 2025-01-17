import type { FC } from 'react'
import { Container, Heading } from '@chakra-ui/react'
import { useQuery } from '@apollo/client'
import type { CitiesData, CitiesVars } from './queries'
import { CITIES } from './queries'
import { Cities } from './Cities'

export const Visited: FC = () => {
  const { loading, error, data } = useQuery<CitiesData, CitiesVars>(CITIES, {
    fetchPolicy: 'network-only', // Stops catch-first policy to ensure we always get the users latest visited cities
    variables: {
      filter: {
        visited: true,
      },
    },
  })

  return (
    <>
      <Heading as="h1">Visited</Heading>
      <Container centerContent maxW="container.md" flexDir="row">
        {error && <p>Error getting your visited cities</p>}
        {!error && <Cities cities={data?.cities?.cities} isLoading={loading} isReadonly={true} />}
      </Container>
    </>
  )
}
