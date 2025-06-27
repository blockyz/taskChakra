import { gql } from 'graphql-request';
import { graphqlClient } from '@/lib/graphqlClient';
import type { CountriesResponse, CubeDataResponse } from '@/types';

const GET_COUNTRIES_QUERY = gql`
  query Countries {
    item(where: { class_id: { _eq: "Country" } }) {
      id
      name: name(path: "en")
      iso2: statements(where: { property_id: { _eq: "iso2" } }) {
        value: postgres_varchar
      }
    }
  }
`;

export const getCountries = async (): Promise<CountriesResponse> => {
  try {
    const data = await graphqlClient.request<CountriesResponse>(GET_COUNTRIES_QUERY);
    // Filter out countries that might be missing a name or ISO2 code, though the query implies they should exist
    const validCountries = data.item.filter(country => country.name && country.iso2 && country.iso2.length > 0 && country.iso2[0].value);
    return { item: validCountries };
  } catch (error) {
    console.error('Error fetching countries:', error);
    // In a real app, you might throw a custom error or return a specific error structure
    throw new Error('Failed to fetch countries');
  }
};

// Placeholder for getCubeData, to be implemented later
const GET_CUBE_DATA_QUERY = gql`
  query CubeData($country: String!, $measure: String!) {
    cube_cube_M6Lh5is0FtqUhZ(where: { country: { _eq: $country }, measure: { _eq: $measure } }) {
      value
      year
    }
  }
`;

interface CubeDataVariables {
  country: string;
  measure: string;
}

export const getCubeData = async (variables: CubeDataVariables): Promise<CubeDataResponse> => {
  try {
    const data = await graphqlClient.request<CubeDataResponse, CubeDataVariables>(
      GET_CUBE_DATA_QUERY,
      variables
    );
    // Sort data by year, assuming it might not come sorted
    const sortedData = data.cube_cube_M6Lh5is0FtqUhZ.sort((a, b) => a.year - b.year);
    return { cube_cube_M6Lh5is0FtqUhZ: sortedData };
  } catch (error)
  {
    console.error('Error fetching cube data:', error);
    throw new Error('Failed to fetch cube data');
  }
};

export const supportedMeasures = [
  { value: 'life_expectancy', label: 'Life Expectancy' },
  { value: 'population', label: 'Population' },
  { value: 'net_migration_rate', label: 'Net Migration Rate' },
];
