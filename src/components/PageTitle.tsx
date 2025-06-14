import { Heading, Box, Flex } from '@chakra-ui/react';
import React from 'react';
import ToggleDarkMode from './ToggleDarkMode';
import SearchBar from './SearchBar';

interface PageTitleProps {
  children: React.ReactNode;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch?: (value: string) => void;
}

const PageTitle = ({ children, searchTerm, setSearchTerm, onSearch }: PageTitleProps) => {
  return (
    <Box
      bgGradient="linear(to-r, red.400, blue.400)"
      p={4}
      color="white"
      textAlign="center"
      mb={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Heading as="h1" flex={1}>
        {children}
      </Heading>
      <Flex align="center" gap={2}>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={onSearch}
          placeholder="Buscar Pokémon..."
        />
        <ToggleDarkMode />
      </Flex>
    </Box>
  );
};

export default PageTitle;
