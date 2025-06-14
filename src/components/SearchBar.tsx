import { Input, Box } from '@chakra-ui/react';
import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
}

const SearchBar = ({ placeholder = 'Search...', value, onChange, onSearch }: SearchBarProps) => {
  // Função para detectar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <Box mb={6} maxW='sm' ml="auto" borderRadius="md" boxShadow="md">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        color={'black'} // Altere para a cor desejada
        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }} // Altere para a cor desejada
        _placeholder={{ color: 'gray.500' }} // Altere para a cor desejada
        background={'white'} // Altere para a cor de fundo desejada
      />
    </Box>
  );
};

export default SearchBar;
