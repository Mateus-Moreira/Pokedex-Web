import React, { useEffect, useState } from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';
import CardGrid from '../components/CardGrid';
import PageTitle from '../components/PageTitle';
import SearchBar from '../components/SearchBar';

const PokemonList = () => {
    const [pokemons, setPokemons] = useState<any[]>([]);
    const [page, setPage] = useState(0); // Controla o número da página
    const [totalPages, setTotalPages] = useState(0); // Número total de páginas
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca
    const limit = 9; // Número de Pokémons por página

    // Função para buscar Pokémons com base na página atual
    const fetchPokemons = async (page: number) => {
        setLoading(true);
        try {
            const offset = page * limit; // Calcula o deslocamento com base na página
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
            const data = await response.json();

            // Atualiza o número total de páginas com base no número total de Pokémons
            setTotalPages(Math.ceil(1118 / limit)); // Supondo que há 1118 Pokémons na API

            // Buscar mais detalhes de cada Pokémon
            const fetches = data.results.map((pokemon: any) =>
                fetch(pokemon.url).then(res => res.json())
            );
            const results = await Promise.all(fetches);
            setPokemons(results); // Atualiza a lista de Pokémons
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        }
        setLoading(false);
    };

    // useEffect para buscar Pokémons na inicialização ou quando a página mudar
    useEffect(() => {
        fetchPokemons(page);
    }, [page]);

    // Função para calcular o range dos botões de paginação visíveis
    const getPaginationRange = () => {
        const start = Math.max(0, page - 2); // Começa dois números antes da página atual
        const end = Math.min(totalPages, start + 5); // Limita a 5 botões
        return Array.from({ length: end - start }, (_, i) => start + i);
    };

    // Filtrar os itens com base no termo de busca
    const filteredItems = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Novo: paginar os resultados filtrados
    const paginatedItems = filteredItems.slice(page * limit, (page + 1) * limit);
    const filteredTotalPages = Math.ceil(filteredItems.length / limit);

    return (
        <Box>
            <PageTitle>Pokémon List</PageTitle>

            {/* Barra de Busca */}
            <Box mb={6} maxW='sm' ml="auto">
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            {/* Listagem de Pokémons Filtrados */}
            <CardGrid
                items={paginatedItems}
                type="pokemon"
            />

            {/* Botões de navegação entre páginas */}
            <HStack justifyContent="center" mt={6}>
                <Button
                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                    isDisabled={page === 0}
                    mr={4}
                >
                    Anterior
                </Button>
                {/* Renderiza botões numerados */}
                {Array.from({ length: filteredTotalPages }, (_, i) => i).map((pageNumber) => (
                    <Button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        isDisabled={loading}
                        colorScheme={pageNumber === page ? 'blue' : 'gray'}
                    >
                        {pageNumber + 1}
                    </Button>
                ))}
                <Button
                    onClick={() => setPage(prev => Math.min(prev + 1, filteredTotalPages - 1))}
                    isDisabled={page === filteredTotalPages - 1}
                    ml={4}
                >
                    Próximo
                </Button>
            </HStack>
        </Box>
    );
};

export default PokemonList;
