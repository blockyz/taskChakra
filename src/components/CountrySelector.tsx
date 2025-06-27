'use client'

import { Select } from '@chakra-ui/react'
import type { Country, SelectOption } from '@/types'
import React from 'react'

interface CountrySelectorProps {
  countries: SelectOption[];
  selectedCountry: string;
  onCountryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isDisabled?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onCountryChange,
  isDisabled,
}) => {
  return (
    <Select
      placeholder="Select country"
      value={selectedCountry}
      onChange={onCountryChange}
      isDisabled={isDisabled || countries.length === 0}
    >
      {countries.map((country) => (
        <option key={country.value} value={country.value}>
          {country.label}
        </option>
      ))}
    </Select>
  )
}

export default CountrySelector;
