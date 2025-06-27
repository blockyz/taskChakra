export interface Country {
  id: string;
  name: string;
  iso2: Array<{ value: string }>;
}

export interface CountriesResponse {
  item: Country[];
}

// Placeholder for CubeData types, to be defined later
export interface CubeDataItem {
  value: number;
  year: number;
}

export interface CubeDataResponse {
  cube_cube_M6Lh5is0FtqUhZ: CubeDataItem[];
}

// Generic type for API error responses if needed
export interface ApiError {
  message: string;
  status?: number;
}

// Types for Select options
export interface SelectOption {
  value: string;
  label: string;
}
