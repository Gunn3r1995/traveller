import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Container, InputRightElement, Input, Heading, InputGroup, IconButton, VStack } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import type { City } from '../../api/src/cities/types'
import { Cities } from './Cities/Cities'

export const Home: FC = () => {
  const [cities, setCities] = useState<City[]>([])

  useEffect(() => {
    // TODO: Create to API Call
  }, [])

  return (
    <VStack spacing="8">
      <Heading as="h1">Smart traveller</Heading>
      <Container maxW="container.md">
        <InputGroup>
          <Input />
          <InputRightElement children={<IconButton aria-label="" icon={<Search2Icon />} />} />
          {cities.length !== 0 && <Cities cities={cities} />}
        </InputGroup>
      </Container>
    </VStack>
  )
}
