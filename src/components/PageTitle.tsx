import { Heading, Box, useColorMode } from '@chakra-ui/react';
import React from 'react';
import ToggleDarkMode from './ToggleDarkMode';

interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle = ({ children }: PageTitleProps) => {
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
      <ToggleDarkMode/>
    </Box>
  );
};

export default PageTitle;
