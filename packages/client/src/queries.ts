import { gql } from "@apollo/client";
import { City } from "../../api/src/cities/types";

export interface CitiesData {
    cities: City[];
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