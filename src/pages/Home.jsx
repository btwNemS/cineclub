import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [films, setFilms] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    fetch(`${API_URL}/films/getAll`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des films");
        }

        return res.json();
      })
      .then((data) => {
        setFilms(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const sectionTitleStyle = {
    fontWeight: 700,
    color: theme.palette.secondary.main,
  };

  const sectionContainerStyle = {
    maxWidth: "1100px",
    margin: "50px auto",
    textAlign: "left",
  };

  const headerRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: "20px",

    borderBottom: `1px solid ${theme.palette.divider}`,

    paddingBottom: "10px",
  };

  return (
    <div className="container">
      <Typography
        variant="h2"
        className="title"
        sx={{
          color: "secondary.main",
          mb: 3,
        }}
      >
        Bienvenue au CinéClub
      </Typography>

      <Typography
        variant="h6"
        sx={{
          maxWidth: "700px",
          margin: "0 auto",
          marginBottom: "60px",

          color: "text.secondary",

          textAlign: "center",
          lineHeight: 1.8,
        }}
      >
        Envie de regarder des films avec le CinéClub de l'IUT ? Nous proposons
        plusieurs séances de cinéma entre étudiants.
      </Typography>

      {/* FILMS PRÉVUS */}

      <Box sx={sectionContainerStyle}>
        <Box sx={headerRowStyle}>
          <Typography variant="h5" sx={sectionTitleStyle}>
            Films prévus
          </Typography>

          <Button
            component={Link}
            to="/filmProgrammed"
            variant="contained"
            color="primary"
          >
            Voir plus
          </Button>
        </Box>

        <div className="films-grid">
          {films
            .filter((film) => film.status === "programmed")
            .slice(0, 6)
            .map((film) => (
              <Link to={`/film/${film.id}`} key={film.id}>
                <div className="card">
                  <img
                    src={`${API_URL}/${film.url_image}`}
                    alt={film.name}
                    className="image"
                  />

                  <div className="card-content">
                    <h2>{film.name}</h2>

                    {film.author && (
                      <p>
                        <strong>Réalisateur :</strong> {film.author}
                      </p>
                    )}

                    {film.film_genre && (
                      <p>
                        <strong>Genre :</strong> {film.film_genre}
                      </p>
                    )}

                    {film.projection_date && (
                      <p>
                        <strong>Projection :</strong>{" "}
                        {new Date(film.projection_date).toLocaleDateString()}
                      </p>
                    )}

                    {film.cinema && (
                      <p>
                        <strong>Cinéma :</strong> {film.cinema}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </Box>

      {/* FILMS SUGGÉRÉS */}

      <Box sx={sectionContainerStyle}>
        <Box sx={headerRowStyle}>
          <Typography variant="h5" sx={sectionTitleStyle}>
            Films suggérés
          </Typography>

          <Button
            component={Link}
            to="/filmSuggested"
            variant="contained"
            color="primary"
          >
            Voir plus
          </Button>
        </Box>

        <div className="films-grid">
          {films
            .filter((film) => film.status === "suggested")
            .slice(0, 3)
            .map((film) => (
              <Link to={`/film/${film.id}`} key={film.id}>
                <div className="card">
                  <img
                    src={`${API_URL}/${film.url_image}`}
                    alt={film.name}
                    className="image"
                  />

                  <div className="card-content">
                    <h2>{film.name}</h2>

                    {film.author && (
                      <p>
                        <strong>Réalisateur :</strong> {film.author}
                      </p>
                    )}

                    {film.film_genre && (
                      <p>
                        <strong>Genre :</strong> {film.film_genre}
                      </p>
                    )}

                    {film.cinema && (
                      <p>
                        <strong>Cinéma :</strong> {film.cinema}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </Box>

      {/* FILMS PASSÉS */}

      <Box sx={sectionContainerStyle}>
        <Box sx={headerRowStyle}>
          <Typography variant="h5" sx={sectionTitleStyle}>
            Films passés
          </Typography>

          <Button
            component={Link}
            to="/filmPassed"
            variant="contained"
            color="primary"
          >
            Voir plus
          </Button>
        </Box>

        <div className="films-grid">
          {films
            .filter((film) => film.status === "passed")
            .slice(0, 3)
            .map((film) => (
              <Link to={`/film/${film.id}`} key={film.id}>
                <div className="card">
                  <img
                    src={`${API_URL}/${film.url_image}`}
                    alt={film.name}
                    className="image"
                  />

                  <div className="card-content">
                    <h2>{film.name}</h2>

                    {film.author && (
                      <p>
                        <strong>Réalisateur :</strong> {film.author}
                      </p>
                    )}

                    {film.film_genre && (
                      <p>
                        <strong>Genre :</strong> {film.film_genre}
                      </p>
                    )}

                    {film.projection_date && (
                      <p>
                        <strong>Projection :</strong>{" "}
                        {new Date(film.projection_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </Box>
    </div>
  );
}
