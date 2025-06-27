'use client'

import { Select } from '@chakra-ui/react'
import type { SelectOption } from '@/types'
import React from 'react'

interface MeasureSelectorProps {
  measures: SelectOption[];
  selectedMeasure: string;
  onMeasureChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isDisabled?: boolean;
}

const MeasureSelector: React.FC<MeasureSelectorProps> = ({
  measures,
  selectedMeasure,
  onMeasureChange,
  isDisabled,
}) => {
  return (
    <Select
      placeholder="Select measure"
      value={selectedMeasure}
      onChange={onMeasureChange}
      isDisabled={isDisabled || measures.length === 0}
    >
      {measures.map((measure) => (
        <option key={measure.value} value={measure.value}>
          {measure.label}
        </option>
      ))}
    </Select>
  )
}

export default MeasureSelector;
