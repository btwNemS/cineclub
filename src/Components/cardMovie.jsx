import { Box, Button, Rating, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentification";
import apiFetch from "./tokencheck";

const API_URL = import.meta.env.VITE_API_URL;

export default function CardMovie({ film, onVoteSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [noteUtilisateur, setNoteUtilisateur] = useState(0);

  if (!film) {
    return <div>Chargement...</div>;
  }

  const moyenne = film.moyenne || film.average_score || 0;

  const isConcours = film?.film_genre
    ?.split(",")
    .map((g) => g.trim().toLowerCase())
    .includes("concours");

  // CORRECTION : Détermination fiable si le film est passé (soit par la date, soit par le texte)
  const today = Date.now();
  const isPassed = 
    film.status === "passed" || 
    film.status === "passé" || 
    (film.status === "programmed" && film.projection_date && new Date(film.projection_date).getTime() < today);

  useEffect(() => {
    // Bloque le fetch du score si le film n'est pas passé ou s'il s'agit d'un concours
    if (isConcours || !isPassed) return;

    async function getScore() {
      if (!user) {
        setNoteUtilisateur(0);
        return;
      }

      try {
        const response = await apiFetch(
          `${API_URL}/scores/protected/getUserScoreForFilm`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ filmId: parseInt(film.id) }),
          },
        );

        if (response.ok) {
          const data = await response.json();

          if (data && data.score !== null && data.score !== undefined) {
            setNoteUtilisateur(data.score);
          } else {
            setNoteUtilisateur(0);
          }
        }
      } catch (error) {
        console.error("Erreur score:", error);
      }
    }

    getScore();
  }, [user, film.id, isConcours, isPassed]);

  return (
    <div className="card">
      <div
        onClick={() => navigate(`/film/${film.id}`)}
        style={{ cursor: "pointer", flex: 1 }}
      >
        <img
          src={`${API_URL}/${film.url_image}`}
          alt={film.name}
          className="image"
        />

        <div className="card-content" style={{ paddingBottom: 0 }}>
          <h2>{film.name}</h2>

          {film.author && (
            <p>
              <strong>Réalisateur :</strong> {film.author}
            </p>
          )}

          {film.film_genre && (
            <p>
              <strong>Genre :</strong>{" "}
              {film.film_genre
                .split(",")
                .filter((g) => g.trim().toLowerCase() !== "concours")
                .join(", ")}
            </p>
          )}

          {film.projection_date && (
            <p>
              <strong>Projection :</strong>{" "}
              {new Date(film.projection_date).toLocaleDateString()} à{" "}
              {new Date(film.projection_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          {film.cinema && (
            <p>
              <strong>Cinéma :</strong> {film.cinema}
            </p>
          )}
        </div>
      </div>

      <div className="card-content" style={{ paddingTop: "10px" }}>
        {isConcours ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/concours")}
            >
              Voir le concours
            </Button>
          </Box>
        ) : (
          /* CORRECTION : Affichage si la condition isPassed globale est vraie */
          isPassed && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                mt: 1,
                flexDirection: "column-reverse",
              }}
            >
              <span
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ display: "inline-flex" }}
              >
                <Rating
                  name={`user-vote-suggested-${film.id}`}
                  value={noteUtilisateur}
                  disabled={!user}
                  size="small"
                  onChange={(event, newValue) => {
                    if (newValue !== null) {
                      setNoteUtilisateur(newValue);

                    apiFetch(`${API_URL}/scores/protected/create`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({
                        filmId: parseInt(film.id),
                        score: newValue,
                      }),
                    })
                      .then((response) => {
                        if (response.ok && onVoteSuccess) {
                          onVoteSuccess();
                        }
                      })
                      .catch((error) => console.error("Erreur vote:", error));
                  }
                }}
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "secondary.main",
                  },
                  "& .MuiRating-iconEmpty": {
                    color: "#B8921F",
                  },
                }}
              />
            </span>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                }}
              >
                Moyenne : {moyenne ? parseFloat(moyenne).toFixed(1) : 0} / 5
              </Typography>
            </Box>
          )
        )}
      </div>
    </div>
  );
}