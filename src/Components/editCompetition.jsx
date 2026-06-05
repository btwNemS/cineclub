import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchCompetitor from "./searchCompetitor";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditCompetition({ onSaveSuccess }) {
  const [listCompetitor, setListCompetitor] = useState(
    [...Array(5)].map(() => null),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitionFilms() {
      try {
        const response = await fetch(`${API_URL}/films/getAll`);
        if (response.ok) {
          const films = await response.json();
          const competitionFilms = films.filter((film) => {
            if (!film.film_genre) return false;
            return film.film_genre
              .split(",")
              .map((g) => g.trim().toLowerCase())
              .includes("concours");
          });

          setListCompetitor((prev) => {
            const updated = [...prev];
            competitionFilms.forEach((film, index) => {
              if (index < 5) updated[index] = film;
            });
            return updated;
          });
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la compétition :",
          error,
        );
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitionFilms();
  }, []);

  const handleSelectCompetitor = (index, film) => {
    setListCompetitor((prev) => {
      const updated = [...prev];
      updated[index] = film;
      return updated;
    });
  };

  const handleRemoveCompetitor = (index) => {
    setListCompetitor((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], _removed: true };
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      const removedFilms = listCompetitor.filter(
        (film) => film && film._removed && film.id,
      );
      for (const film of removedFilms) {
        const genres = film.film_genre
          ? film.film_genre
              .split(",")
              .map((g) => g.trim())
              .filter((g) => g.toLowerCase() !== "concours" && g !== "")
          : [];
        await saveFilmGenres(film, genres.join(","));
      }

      const activeCompetitors = listCompetitor.filter(
        (film) => film && !film._removed,
      );
      for (const film of activeCompetitors) {
        const genres = film.film_genre
          ? film.film_genre
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean)
          : [];
        if (!genres.includes("concours")) {
          genres.push("concours");
        }
        await saveFilmGenres(film, genres.join(","));
      }

      console.log("Compétition mise à jour avec succès");
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  const saveFilmGenres = async (film, updatedGenres) => {
    const form = new FormData();
    form.append("name", film.name ?? "");
    form.append("synopsis", film.synopsis ?? "");
    form.append("status", film.status ?? "");
    form.append("author", film.author ?? "");
    form.append("film_genre", updatedGenres);
    form.append("url_allocine", film.url_allocine ?? "");
    form.append("url_imdb", film.url_imdb ?? "");
    form.append("url_youtube", film.url_youtube ?? "");
    if (film.cinema) form.append("cinema", film.cinema);
    if (film.projection_date)
      form.append("projection_date", film.projection_date);

    const response = await fetch(
      `${API_URL}/films/protected/update/${film.id}`,
      {
        method: "PUT",
        credentials: "include",
        body: form,
      },
    );
    return response.ok;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        Modifier la Compétition En Cours
      </Typography>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2}>
          {listCompetitor.map((film, index) => {
            const isFilmActive = film && !film._removed;
            return (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  width: 300,
                  aspectRatio: "9/16",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  transition: "0.2s",
                  p: 2,
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                {isFilmActive && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemoveCompetitor(index)}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      minWidth: "auto",
                    }}
                  >
                    Retirer
                  </Button>
                )}

                {isFilmActive ? (
                  <Box>
                    {" "}
                    <img
                      src={`${API_URL}/${film.url_image}`}
                      alt={film.name}
                      className="image"
                    />
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{ textAlign: "center" }}
                    >
                      {film.name}
                    </Typography>
                  </Box>
                ) : (
                  <SearchCompetitor
                    onSelect={(selectedFilm) =>
                      handleSelectCompetitor(index, selectedFilm)
                    }
                  />
                )}
              </Paper>
            );
          })}
        </Stack>
        <Box>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Enregistrer les modifications
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
