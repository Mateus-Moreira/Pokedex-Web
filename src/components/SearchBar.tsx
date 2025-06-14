import { Input, Box } from '@chakra-ui/react';
import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ placeholder = 'Search...', value, onChange }: SearchBarProps) => (
  <Box mb={6} maxW='sm' ml="auto">
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </Box>
);

export default SearchBar;
