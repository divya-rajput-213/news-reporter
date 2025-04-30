// components/SearchForm.tsx

import React, {  useRef } from 'react';
import { TextField, Button, Box, Paper, List, ListItem, Typography } from '@mui/material';
import { SearchFormProps } from '@/types/types';

const SearchForm: React.FC<SearchFormProps> = ({ query, setQuery, handleSearch, suggestions }) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);
console.log('suggestions :>> ', suggestions);
  return (
    <form onSubmit={(e) => handleSearch(e)}>
      <Box sx={{ display: "flex", gap: 2, position: "relative" }}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for topics, headlines, etc."
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ px: 4 }}>
          Search
        </Button>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <Paper
            ref={suggestionsRef}
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: "100px",
              zIndex: 10,
              maxHeight: 250,
              overflowY: "auto",
              mt: 1,
            }}
          >
            <List>
              {suggestions.map((suggestion, index) => {
                console.log('suggestion :>> ', suggestion);
                return(
                <ListItem
                  key={index}
                  sx={{ cursor: "pointer", ":hover": { backgroundColor: "#f0f0f0" } }}
                  onClick={() => handleSearch(null, suggestion)}
                >
                  <Typography variant="body2">{suggestion}</Typography>
                </ListItem>
              )})}
            </List>
          </Paper>
        )}
      </Box>
    </form>
  );
};

export default SearchForm;
