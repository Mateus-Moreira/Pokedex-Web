import { IconButton, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react';

const ToggleDarkMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="Toggle dark mode"
      icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
      onClick={toggleColorMode}
      colorScheme="dark"
    />
  );
};

export default ToggleDarkMode;
