import React, { useEffect, useState } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import PageTitle from '../components/PageTitle';
import CardGrid from '../components/CardGrid';

const ItemList = () => {
    const [itens, setItens] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca
    const { colorMode, toggleColorMode } = useColorMode();

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/item?limit=12')
            .then(response => response.json())
            .then(data => {
                const fetches = data.results.map((item: any) =>
                    fetch(item.url).then(res => res.json())
                );
                Promise.all(fetches).then(results => setItens(results));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Filtrar os itens com base no termo de busca
    const filteredItems = itens.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <PageTitle
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            >
                Item List
            </PageTitle>
            {/* Listagem de Itens Filtrados */}
            <CardGrid
                items={filteredItems}
                type="item"
            />
        </Box>
    );
};

export default ItemList;
