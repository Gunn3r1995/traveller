import React from 'react'
import type { FC } from 'react'
import { Container, Heading } from '@chakra-ui/react'
import { Cities } from './Cities/Cities'
import { useQuery } from '@apollo/client'
import { CITIES, CitiesData, CitiesVars } from './queries'

export const WishList: FC = () => {
  const { loading, error, data, refetch } = useQuery<CitiesData, CitiesVars>(CITIES, {
    fetchPolicy: 'network-only', // Stops catch-first policy to ensure we always get the users latest visited cities
    variables: {
      filter: {
        wishlist: true,
      },
    },
  })

  return (
    <>
      <Heading as="h1">Wish list</Heading>
      <Container centerContent maxW="container.md" flexDir="row">
        {error && <p>Error getting your wishlist cities</p>}
        {!error && <Cities cities={data?.cities?.cities} isLoading={loading} isReadonly={true} />}
      </Container>
    </>
  )
}
