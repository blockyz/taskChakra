'use client'

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CubeDataItem } from '@/types';
import { Box, Text } from '@chakra-ui/react';

interface DataChartProps {
  data: CubeDataItem[];
  measureLabel: string;
}

const DataChart: React.FC<DataChartProps> = ({ data, measureLabel }) => {
  if (!data || data.length === 0) {
    return (
      <Box p={5} borderWidth="1px" borderRadius="lg" textAlign="center">
        <Text>No data available for the selected criteria.</Text>
      </Box>
    );
  }

  // Formatting for Y-axis tick if numbers are very large (e.g., population)
  const yAxisTickFormatter = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toString();
  };


  return (
    <Box height="400px" width="100%">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={yAxisTickFormatter} />
          <Tooltip formatter={(value: number) => [value.toLocaleString(), measureLabel]} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" name={measureLabel} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DataChart;
