import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function SearchCompetitor({ onSelect }) {
  const [films, setFilms] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/films/getAll`)
      .then((res) => res.json())
      .then((data) => {
        setFilms(data.filter((film) => film.status === "suggested"));
      })
      .catch(console.error);
  }, []);

  const handleSelect = (film) => {
    setSelectedFilm(film);
    setOpenSearch(false);

    if (onSelect) {
      onSelect(film);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 40,
      }}
    >
      {selectedFilm ? (
        <Button variant="contained" color="secondary">
          {selectedFilm.name}
        </Button>
      ) : openSearch ? (
        <Autocomplete
          size="small"
          options={films}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => {
            if (value) {
              handleSelect(value);
            }
          }}
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Choisir un film..." autoFocus />
          )}
        />
      ) : (
        <Button
          variant="contained"
          onClick={() => setOpenSearch(true)}
          sx={{
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: "50%",
            fontSize: 24,
            p: 0,
          }}
        >
          +
        </Button>
      )}
    </Box>
  );
}
