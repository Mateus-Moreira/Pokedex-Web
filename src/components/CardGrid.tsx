import { Box, Image, Text, Button, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import pokeballBg from '../img/pokeball-bg.png';

interface CardGridProps {
  items: any[];
  type: 'pokemon' | 'item';
  onDetailsClick?: (item: any) => void;
}

const CardGrid = ({ items, type, onDetailsClick }: CardGridProps) => (
  <Box px={{ base: 2, md: 8 }}>
    <SimpleGrid
      minChildWidth="350px"
      spacing={4}
      px={4}

    >
      {items.map((item, index) => (
        <Box
          key={index}
          maxW='sm'
          w='100%'
          bg="red.500"
          border="1px solid black"
          p={4}
          borderRadius="lg"
          backgroundImage={`url(${pokeballBg})`}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          backgroundPosition="65px"
        >
          {type === 'pokemon' ? (
            <>
              <Text fontWeight="bold" color="white" mr={2}>#{String(item.id).padStart(4, '0')}</Text>
              <Box maxW='sm' boxSize="120px" border="1px solid black" p={2} borderRadius="lg" bg="cyan.200" display="flex" justifyContent="center" alignItems="center">
                <Image src={item.sprites.versions['generation-v']['black-white'].animated.front_default} boxSize="80px" alt={item.name} />
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <Text fontWeight="bold" color="white">{item.name}</Text>
              </Box>
            </>
          ) : (
            <>
              <Box maxW='sm' boxSize="120px" border="1px solid black" p={2} borderRadius="lg" bg="cyan.200" display="flex" justifyContent="center" alignItems="center">
                <Image src={item.sprites.default} boxSize="80px" alt={item.name} />
              </Box>
              <Text fontWeight="bold" color="white" mt={2}>{item.name}</Text>
            </>
          )}
          <Button mt={2} colorScheme="blue" onClick={() => onDetailsClick && onDetailsClick(item)}>
            Detalhes
          </Button>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
);

export default CardGrid;
