import { gql } from "@apollo/client";

export interface CityResponse {
  name: string,
  country: string
}

export interface CitiesData {
    cities: {
      cities: CityResponse[];
    }
}

export interface CitiesVars {
}

export const CITIES = gql`
  query GetCities {
    cities {
        cities {
          name
          country
        }
      }
  }
`