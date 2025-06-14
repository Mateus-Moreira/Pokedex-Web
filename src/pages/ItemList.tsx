import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import PageTitle from '../components/PageTitle';
import CardGrid from '../components/CardGrid';

const ItemList = () => {
    const [itens, setItens] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchApiResult, setSearchApiResult] = useState<any[] | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [allItemNames, setAllItemNames] = useState<any[]>([]);
    const observer = useRef<IntersectionObserver | null>(null);
    const limit = 12;

    // Carrega todos os nomes de itens uma vez
    useEffect(() => {
        const fetchAllNames = async () => {
            const response = await fetch('https://pokeapi.co/api/v2/item?limit=2000');
            const data = await response.json();
            setAllItemNames(data.results); // [{name, url}]
        };
        fetchAllNames();
    }, []);

    // Função para buscar itens (infinite scroll)
    const fetchItens = async (pageToFetch: number) => {
        setLoading(true);
        try {
            const offset = pageToFetch * limit;
            const response = await fetch(`https://pokeapi.co/api/v2/item?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            if (data.results.length === 0) setHasMore(false);
            const fetches = data.results.map((item: any) =>
                fetch(item.url).then(res => res.json())
            );
            const results = await Promise.all(fetches);
            setItens(prev => {
                const ids = new Set(prev.map(i => i.id));
                const novos = results.filter(i => !ids.has(i.id));
                return [...prev, ...novos];
            });
        } catch (error) {
            setHasMore(false);
            console.error('Error fetching items:', error);
        }
        setLoading(false);
    };

    // Carrega a primeira página apenas uma vez
    useEffect(() => {
        fetchItens(0);
        setPage(1);
    }, []);

    // Carrega as próximas páginas quando page muda
    useEffect(() => {
        if (page === 0) return;
        fetchItens(page);
    }, [page]);

    // Infinite scroll: observar o último card
    const lastItemElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading && searchApiResult === null) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, searchApiResult]);

    // Função de busca por substring ao pressionar Enter
    const handleSearch = async (value: string) => {
        if (!value) {
            setSearchApiResult(null);
            setSearchError(null);
            return;
        }
        setLoading(true);
        setSearchError(null);
        try {
            const filtered = allItemNames.filter((i: any) =>
                i.name.toLowerCase().includes(value.toLowerCase())
            );
            if (filtered.length === 0) throw new Error('Nenhum item encontrado');
            const fetches = filtered.map((item: any) =>
                fetch(item.url).then(res => res.json())
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
    const itemsToShow = searchApiResult !== null ? searchApiResult : itens;

    return (
        <Box>
            <Box position="sticky" top={0} zIndex={100} bg="white" _dark={{ bg: 'gray.800' }}>
                <PageTitle
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={handleSearch}
                >
                    Itens
                </PageTitle>
            </Box>
            <CardGrid
                items={itemsToShow}
                type="item"
            />
            {searchError && (
                <Box color="red.500" textAlign="center" mt={2}>{searchError}</Box>
            )}
            {/* Elemento sentinela para infinite scroll */}
            {searchApiResult === null && (
                <div ref={lastItemElementRef} style={{ height: 1 }} />
            )}
            {loading && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Spinner size="lg" />
                </Box>
            )}
        </Box>
    );
};

export default ItemList;
