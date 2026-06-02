import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import SearchCompetitor from "./searchCompetitor";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddCompetition() {
  const [listCompetitor, setListCompetitor] = useState([]);

  const handleSelectCompetitor = (index, film) => {
    setListCompetitor((prev) => {
      const updated = [...prev];
      updated[index] = film;
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      const competitors = listCompetitor.filter(Boolean);

      console.log("Compétiteurs sélectionnés :", competitors);

      for (const film of competitors) {
        const genres = film.film_genre
          ? film.film_genre
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean)
          : [];

        if (!genres.includes("concours")) {
          genres.push("concours");
        }

        const updatedGenres = genres.join(",");

        console.log("Film :", film.name);
        console.log("Avant :", film.film_genre);
        console.log("Après :", updatedGenres);

        const form = new FormData();

        form.append("name", film.name ?? "");
        form.append("synopsis", film.synopsis ?? "");
        form.append("status", film.status ?? "");
        form.append("author", film.author ?? "");
        form.append("film_genre", updatedGenres);

        form.append("url_allocine", film.url_allocine ?? "");
        form.append("url_imdb", film.url_imdb ?? "");
        form.append("url_youtube", film.url_youtube ?? "");

        if (film.cinema) {
          form.append("cinema", film.cinema);
        }

        if (film.projection_date) {
          form.append("projection_date", film.projection_date);
        }

        const response = await fetch(
          `${API_URL}/films/protected/update/${film.id}`,
          {
            method: "PUT",
            credentials: "include",
            body: form,
          },
        );

        console.log(`Mise à jour film ${film.id} :`, response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(errorText);
        }
      }

      console.log("Compétition enregistrée");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        Créer ou Modifier une Compétition
      </Typography>

      <Stack spacing={4}>
        <Stack direction="row" spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                width: 300,
                aspectRatio: "9/16",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <SearchCompetitor
                onSelect={(film) => handleSelectCompetitor(index, film)}
              />
            </Paper>
          ))}
        </Stack>

        <Box>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
