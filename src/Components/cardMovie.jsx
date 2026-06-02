import { useEffect, useState } from "react";
import { Box, Rating, Stack, Typography } from "@mui/material";
import { useAuth } from "../Authentification";
import { useNavigate } from "react-router-dom"; // Pour aller sur la page du film proprement

const API_URL = import.meta.env.VITE_API_URL;

export default function CardMovie({ film, onVoteSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [noteUtilisateur, setNoteUtilisateur] = useState(0);

  if (!film) {
    return <div>Chargement...</div>;
  }

  const moyenne = film.moyenne || film.average_score || 0;

  // Charger la note que l'utilisateur a déjà donnée à ce film
  useEffect(() => {
    async function getScore() {
      if (!user) {
        setNoteUtilisateur(0);
        return;
      }
      try {
        const response = await fetch(
          `${API_URL}/scores/protected/getUserScoreForFilm`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ filmId: parseInt(film.id) }),
          }
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
  }, [user, film.id]);

  // Enregistrer le vote en BDD
  const handleVote = async (event, newValue) => {
    event.stopPropagation(); // Coupe court à toute propagation

    if (!user || !newValue) return;

    setNoteUtilisateur(newValue);

    try {
      const response = await fetch(`${API_URL}/scores/protected/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ filmId: parseInt(film.id), score: newValue }),
      });

      if (response.ok && onVoteSuccess) {
        onVoteSuccess(); // Met à jour la moyenne textuelle
      }
    } catch (error) {
      console.error("Erreur vote:", error);
    }
  };

  return (
    <div className="card">
      {/* Zone cliquable supérieure : redirection vers la page du film */}
      <div
        onClick={() => navigate(`/film/${film.id}`)}
        style={{ cursor: "pointer" }}
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
      {/* Zone inférieure : Totalement isolée pour que le vote fonctionne à 100% */}
      <div className="card-content" style={{ paddingTop: "10px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Pousse les étoiles à gauche et le texte à droite
            width: "100%",
            mt: 1,
          }}
        >
          {/* Les 5 étoiles cliquables à gauche, isolées dans un span bloquant */}
          <span
            onClick={(e) => {
              e.stopPropagation(); // Bloque la redirection vers la page du film à 100%
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

                  // Envoi immédiat à l'API
                  fetch(`${API_URL}/scores/protected/create`, {
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
                        onVoteSuccess(); // Rafraîchit la moyenne à droite
                      }
                    })
                    .catch((error) => console.error("Erreur vote:", error));
                }
              }}
              sx={{
                "& .MuiRating-iconFilled": { color: "secondary.main" },
                "& .MuiRating-iconEmpty": { color: "#B8921F" },
              }}
            />
          </span>

          {/* Moyenne affichée en texte poussée tout à droite */}
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              fontSize: "0.95rem",
              whiteSpace: "nowrap", // Empêche le texte de sauter à la ligne
            }}
          >
            Moyenne : {moyenne ? parseFloat(moyenne).toFixed(1) : 0} / 5
          </Typography>
        </Box>
      </div>
    </div>
  );
}
