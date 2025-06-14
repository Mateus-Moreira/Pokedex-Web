import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import CardGrid from '../components/CardGrid';
import PageTitle from '../components/PageTitle';

const PokemonList = () => {
    const [pokemons, setPokemons] = useState<any[]>([]);
    const [page, setPage] = useState(0); // Página atual
    const [hasMore, setHasMore] = useState(true); // Se ainda há mais pokémons para carregar
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchApiResult, setSearchApiResult] = useState<any | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [allPokemonNames, setAllPokemonNames] = useState<any[]>([]);
    const limit = 9;
    const observer = useRef<IntersectionObserver | null>(null);

    // Função para buscar Pokémons
    const fetchPokemons = async (pageToFetch: number) => {
        setLoading(true);
        try {
            const offset = pageToFetch * limit;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            if (data.results.length === 0) setHasMore(false);
            // Buscar detalhes
            const fetches = data.results.map((pokemon: any) =>
                fetch(pokemon.url).then(res => res.json())
            );
            const results = await Promise.all(fetches);
            setPokemons(prev => {
                // Evita duplicidade
                const ids = new Set(prev.map(p => p.id));
                const novos = results.filter(p => !ids.has(p.id));
                return [...prev, ...novos];
            });
        } catch (error) {
            setHasMore(false);
            console.error('Error fetching Pokémon:', error);
        }
        setLoading(false);
    };

    // Carrega a primeira página apenas uma vez
    useEffect(() => {
        fetchPokemons(0);
        setPage(1); // Próxima página será 1
        // eslint-disable-next-line
    }, []);

    // Carrega as próximas páginas quando page muda (mas não na inicialização)
    useEffect(() => {
        if (page === 0) return;
        fetchPokemons(page);
        // eslint-disable-next-line
    }, [page]);

    // Carrega todos os nomes de Pokémon uma vez
    useEffect(() => {
        const fetchAllNames = async () => {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118');
            const data = await response.json();
            setAllPokemonNames(data.results); // [{name, url}]
        };
        fetchAllNames();
    }, []);

    // Infinite scroll: observar o último card
    const lastPokemonElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Filtrar os itens com base no termo de busca
    const filteredItems = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função para buscar Pokémon por nome na API
    const handleSearch = async (value: string) => {
        if (!value) return;
        setLoading(true);
        setSearchError(null);
        try {
            // Busca todos os nomes que contenham o termo
            const filtered = allPokemonNames.filter((p: any) =>
                p.name.toLowerCase().includes(value.toLowerCase())
            );
            if (filtered.length === 0) throw new Error('Nenhum Pokémon encontrado');
            // Busca detalhes de todos os encontrados
            const fetches = filtered.map((pokemon: any) =>
                fetch(pokemon.url).then(res => res.json())
            );
            const results = await Promise.all(fetches);
            setSearchApiResult(results);
        } catch (err: any) {
            setSearchApiResult([]);
            setSearchError(err.message);
        }
        setLoading(false);
    };

    // Se houver resultado de busca, mostra só ele
    const itemsToShow = searchApiResult !== null ? searchApiResult : filteredItems;

    return (
        <Box>
            {/* Container fixo para título e busca */}
            <Box position="sticky" top={0} zIndex={100} bg="white" _dark={{ bg: 'gray.800' }}>
                <PageTitle
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    onSearch={handleSearch}
                >
                    Pokémon List
                </PageTitle>
            </Box>
            {/* Listagem de Pokémons Filtrados ou resultado da busca */}
            <CardGrid
                items={itemsToShow}
                type="pokemon"
            />
            {searchError && (
                <Box color="red.500" textAlign="center" mt={2}>{searchError}</Box>
            )}
            {/* Elemento sentinela para infinite scroll */}
            {searchApiResult === null && (
                <div ref={lastPokemonElementRef} style={{ height: 1 }} />
            )}
            {loading && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Spinner size="lg" />
                </Box>
            )}
            {!hasMore && !loading && searchApiResult === null && (
                <Box textAlign="center" mt={4} color="gray.500">
                    Todos os Pokémons carregados.
                </Box>
            )}
        </Box>
    );
};

export default PokemonList;
