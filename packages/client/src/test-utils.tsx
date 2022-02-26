import * as React from 'react'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { MockedResponse } from '@apollo/client/testing'
import { GraphQLRequest, FetchResult } from '@apollo/client'
import { CITIES, CITIES_LIMIT, CityResponse, UPDATE_CITY } from './queries'
import { GraphQLError } from 'graphql'

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

export { customRender as render }

export class GetCitiesRequestSeeder implements MockedResponse<Record<string, any>> {
  public request: GraphQLRequest
  public result: FetchResult<Record<string, any>, Record<string, any>, Record<string, any>> | undefined
  public error?: Error | undefined

  public cities: CityResponse[]

  constructor() {
    this.request = {
      query: CITIES,
    }

    this.cities = [
      { id: 1, name: 'London', country: 'United Kingdom', visited: false, wishlist: false },
      { id: 1, name: 'Moscow', country: 'Russia', visited: false, wishlist: false },
    ]
  }

  public RespondsWithError(): GetCitiesRequestSeeder {
    this.result = {
      errors: [new GraphQLError('Error!')],
    }

    return this
  }

  public RespondsWithCities(filter?: string, cities?: CityResponse[], offset?: number): GetCitiesRequestSeeder {
    this.request = {
      ...this.request,
      variables: {
        filter: {
          name: filter,
        },
        limit: CITIES_LIMIT,
        offset: offset == undefined ? 0 : offset,
      },
    }

    this.result = {
      data: {
        cities: {
          cities: cities == undefined ? this.cities : cities,
        },
      },
    }

    return this
  }

  public RespondsWithVisitedCities(visited?: boolean, cities?: CityResponse[]): GetCitiesRequestSeeder {
    this.request = {
      ...this.request,
      variables: {
        filter: {
          visited: visited,
        },
      },
    }

    this.result = {
      data: {
        cities: {
          cities: cities == undefined ? this.cities : cities,
        },
      },
    }

    return this
  }

  public RespondsWithWishlistCities(wishlist?: boolean, cities?: CityResponse[]): GetCitiesRequestSeeder {
    this.request = {
      ...this.request,
      variables: {
        filter: {
          wishlist: wishlist,
        },
      },
    }

    this.result = {
      data: {
        cities: {
          cities: cities == undefined ? this.cities : cities,
        },
      },
    }

    return this
  }
}

export class UpdateCityRequestSeeder implements MockedResponse<Record<string, any>> {
  public request: GraphQLRequest
  public result: FetchResult<Record<string, any>, Record<string, any>, Record<string, any>> | undefined
  public error?: Error | undefined

  public city: CityResponse

  constructor() {
    this.request = {
      query: UPDATE_CITY,
    }

    this.city = { id: 1, name: 'London', country: 'United Kingdom', visited: false, wishlist: false }
  }

  public UpdateVisited(visited: boolean): UpdateCityRequestSeeder {
    this.request = {
      ...this.request,
      variables: {
        input: {
          id: 1,
          visited: visited,
        },
      },
    }

    this.result = {
      data: {
        cities: {
          cities: { ...this.city, visited: visited },
        },
      },
    }

    return this
  }

  public UpdateWishlist(wishlist: boolean): UpdateCityRequestSeeder {
    this.request = {
      ...this.request,
      variables: {
        input: {
          id: 1,
          wishlist: wishlist,
        },
      },
    }

    this.result = {
      data: {
        cities: {
          cities: { ...this.city, wishlist: wishlist },
        },
      },
    }

    return this
  }
}
