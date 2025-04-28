import { Box, TextField, Button } from '@mui/material';
import { SearchProps } from '@/types/types';

const Search: React.FC<SearchProps> = ({ handleSearch, query, setQuery }) => {
  return (
    <Box component="form" onSubmit={handleSearch} display="flex" gap={2}>
      <TextField
        variant="outlined"
        label="Ask for latest news..."
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ px: 4 }}>
        Search
      </Button>
    </Box>
  );
};

export default Search;
