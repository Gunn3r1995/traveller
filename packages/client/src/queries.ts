import { gql } from "@apollo/client";

export interface CitiesFilters {
  name: string | undefined
}

export interface CityResponse {
  id: number,
  name: string,
  country: string
}

export interface CitiesData {
    cities: {
      cities: CityResponse[];
    }
}

export interface CitiesVars {
  filter: CitiesFilters | undefined;
}

export const CITIES = gql`
  query GetCities($filter: CitiesFilters) {
    cities(filter: $filter) {
        cities {
          id
          name
          country
        }
      }
  }
`