'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Container, VStack, Heading, Text, Spinner, Alert, AlertIcon, Box, HStack } from '@chakra-ui/react'
import { getCountries, getCubeData, supportedMeasures } from '@/services/api'
import CountrySelector from '@/components/CountrySelector'
import MeasureSelector from '@/components/MeasureSelector'
import DataChart from '@/components/DataChart'
import type { Country, SelectOption, CubeDataItem } from '@/types'

export default function Home() {
  const queryClient = useQueryClient(); // For invalidating queries
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedMeasure, setSelectedMeasure] = useState<string>('');

  // Fetching countries
  const {
    data: countriesData,
    isLoading: isLoadingCountries,
    isError: isErrorCountries,
    error: errorCountries,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: Infinity, // Country list is unlikely to change frequently
  });

  const countryOptions = useMemo((): SelectOption[] => {
    if (!countriesData?.item) return [];
    return countriesData.item
      .map((country: Country) => ({
        // Use country.id (which is the GraphQL node ID like 'poland') if your getCubeData expects that.
        // If getCubeData expects ISO code, you'd need to ensure iso2[0].value is consistently available
        // and map to that. The current GQL query for CubeData uses `country: {_eq: "poland"}`,
        // implying it uses the ID-like string.
        value: country.id,
        label: country.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [countriesData]);

  // Fetching cube data (dependent query)
  const {
    data: cubeData,
    isLoading: isLoadingCubeData,
    isError: isErrorCubeData,
    error: errorCubeData,
    isFetching: isFetchingCubeData,
  } = useQuery({
    queryKey: ['cubeData', selectedCountry, selectedMeasure],
    queryFn: () => {
      if (!selectedCountry || !selectedMeasure) {
        return Promise.resolve(null); // Should not happen due to `enabled` flag
      }
      return getCubeData({ country: selectedCountry, measure: selectedMeasure });
    },
    enabled: !!selectedCountry && !!selectedMeasure, // Only run query if both are selected
    retry: 1, // Retry once on failure for this query
  });

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = event.target.value;
    setSelectedCountry(newCountry);
    setSelectedMeasure(''); // Reset measure when country changes
    // Invalidate and reset cubeData query to clear old data chart
    queryClient.resetQueries({ queryKey: ['cubeData', selectedCountry, selectedMeasure], exact: false });
    queryClient.invalidateQueries({ queryKey: ['cubeData', newCountry], exact: false });

  };

  const handleMeasureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMeasure(event.target.value);
  };

  const currentMeasureLabel = useMemo(() => {
    return supportedMeasures.find(m => m.value === selectedMeasure)?.label || 'Data';
  }, [selectedMeasure]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" textAlign="center">
          Country Profile Dashboard
        </Heading>

        <HStack spacing={4} align="flex-start">
          <Box flex={1}>
            <Heading as="h2" size="md" mb={2}>
              Select Country
            </Heading>
            {isLoadingCountries && <Spinner size="sm" />}
            {isErrorCountries && (
              <Alert status="error" size="sm">
                <AlertIcon />
                {errorCountries instanceof Error ? errorCountries.message : 'Error fetching countries'}
              </Alert>
            )}
            {countriesData && (
              <CountrySelector
                countries={countryOptions}
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                isDisabled={isLoadingCountries || isErrorCountries}
              />
            )}
          </Box>

          <Box flex={1}>
            <Heading as="h2" size="md" mb={2}>
              Select Measure
            </Heading>
            <MeasureSelector
              measures={supportedMeasures}
              selectedMeasure={selectedMeasure}
              onMeasureChange={handleMeasureChange}
              isDisabled={!selectedCountry || isLoadingCubeData || isFetchingCubeData}
            />
          </Box>
        </HStack>

        <Box mt={8}>
          {isLoadingCubeData && <Box textAlign="center"><Spinner /> <Text>Loading chart data...</Text></Box>}
          {isErrorCubeData && !isLoadingCubeData && ( // Show error only if not loading (to avoid flash of error)
            <Alert status="error">
              <AlertIcon />
              Error fetching data for {currentMeasureLabel} in {countryOptions.find(c => c.value === selectedCountry)?.label || 'selected country'}: {errorCubeData instanceof Error ? errorCubeData.message : 'Unknown error'}
            </Alert>
          )}
          {cubeData && cubeData.cube_cube_M6Lh5is0FtqUhZ && !isLoadingCubeData && !isErrorCubeData && (
            <DataChart data={cubeData.cube_cube_M6Lh5is0FtqUhZ} measureLabel={currentMeasureLabel} />
          )}
          {!cubeData && !selectedCountry && !selectedMeasure && !isLoadingCubeData && !isErrorCubeData && (
             <Box p={5} borderWidth="1px" borderRadius="lg" textAlign="center" mt={4}>
                <Text>Please select a country and a measure to display data.</Text>
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
