import { Box, Text, Flex, Link, IconButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label="Abrir menu"
        icon={<HamburgerIcon />}
        onClick={() => setIsOpen(true)}
        position="fixed"
        top={4}
        left={4}
        zIndex={1100}
        display={isOpen ? 'none' : 'block'}
        bg="gray.800"
        color="white"
        _hover={{ bg: 'gray.700' }}
      />
      <Box
        as="nav"
        position="fixed"
        left={isOpen ? 0 : '-220px'}
        top={0}
        h="100vh"
        w="220px"
        bg="gray.800"
        color="white"
        p={4}
        transition="left 0.3s"
        zIndex={1200}
        boxShadow={isOpen ? '2xl' : 'none'}
      >
        <Flex justify="space-between" align="center" mb={8}>
          <Text fontSize="xl">Menu</Text>
          <IconButton
            aria-label="Fechar menu"
            icon={<CloseIcon />}
            size="sm"
            onClick={() => setIsOpen(false)}
            bg="gray.700"
            color="white"
            _hover={{ bg: 'gray.600' }}
          />
        </Flex>
        <Link as={RouterLink} to="/pokemons" mb={4} display="block" fontSize="lg" onClick={() => setIsOpen(false)}>
          Pokémons
        </Link>
        <Link as={RouterLink} to="/items" display="block" fontSize="lg" onClick={() => setIsOpen(false)}>
          Itens
        </Link>
      </Box>
      {/* Espaço para o conteúdo não ficar atrás do sidebar */}
      <Box w={isOpen ? '220px' : '0'} transition="w 0.3s" display={{ base: 'none', md: 'block' }} />
    </>
  );
};

export default Sidebar;
