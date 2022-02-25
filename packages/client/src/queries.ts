import { gql } from "@apollo/client";

export interface CitiesFilters {
  name?: string
}

export interface CitiesMutationInput {
  input: {
    id: number,
    wishlist?: boolean,
    visited?: boolean
  }
}

export interface CityResponse {
  id: number,
  name: string,
  country: string,
  visited: boolean,
  wishlist: boolean
}

export interface CitiesData {
    cities: {
        cities: CityResponse[]
    }
}

export interface CitiesVars {
  filter?: CitiesFilters
}

export const CITIES = gql`
  query GetCities($filter: CitiesFilters) {
    cities(filter: $filter) {
        cities {
          id
          name
          country
          visited
          wishlist
        }
      }
  }
`

export const UPDATE_CITY = gql`
mutation UpdateCity($input: CitiesMutationInput) {
  updateCity(input: $input) {
      id
      name
      country
      visited
      wishlist
  }
}
`