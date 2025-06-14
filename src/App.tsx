import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import PokemonList from './pages/PokemonList';
import ItemList from './pages/ItemList';
import Sidebar from './components/Sidebar';

function App() {
    return (
        <Router>
            <Box>
                <Sidebar />
                <Box ml={{ base: 0 }} p={4} transition="margin-left 0.3s">
                    <Routes>
                        <Route path="/pokemons" element={<PokemonList />} />
                        <Route path="/items" element={<ItemList />} />
                        <Route path="/" element={<PokemonList />} />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

export default App;
