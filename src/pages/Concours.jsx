import { CircularProgress, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentification";
import DynamicText from "../Components/dymanicText";
import apiFetch from "../Components/tokencheck";

const API_URL = import.meta.env.VITE_API_URL;

const MEDAL = {
  0: { color: "#d4af37", label: "Or" },
  1: { color: "#b0b8c1", label: "Argent" },
  2: { color: "#a0694a", label: "Bronze" },
};

const SCORES = [
  { value: 1, label: "NON MERCI" },
  { value: 3, label: "POURQUOI PAS" },
  { value: 5, label: "JE VEUX VOIR" },
];

function RatingButton({ score, selected, onClick, disabled }) {
  const theme = useTheme();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // Évite absolument de déclencher la redirection vers la page du film
        if (!disabled) onClick(score.value);
      }}
      disabled={disabled}
      style={{
        flex: 1,
        padding: "7px 10px",
        border: selected
          ? `1.5px solid ${theme.palette.secondary.main}`
          : `1.5px solid ${alpha(theme.palette.text.primary, 0.1)}`,
        borderRadius: "6px",
        background: selected
          ? alpha(theme.palette.secondary.main, 0.12)
          : "transparent",
        color: selected
          ? theme.palette.secondary.main
          : theme.palette.text.secondary,
        fontSize: "0.8rem",
        fontWeight: selected ? 600 : 400,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
        zIndex: 10,
      }}
    >
      {score.label}
    </button>
  );
}

function FilmRow({ film, rank, totalMoyennes, currentScore, onVote, disabled }) {
  const moyenne = Number(film.moyenne || film.average_score || 0);
  const theme = useTheme();
  const navigate = useNavigate();

  const percent =
    totalMoyennes > 0 ? Math.round((moyenne / totalMoyennes) * 100) : 0;

  const medal = MEDAL[rank];
  const isFirst = rank === 0;

  return (
    <div
      onClick={() => navigate(`/film/${film.id}`)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: isFirst ? "20px 24px" : "14px 20px",
        borderRadius: "12px",
        marginBottom: "25px",
        border: `1.5px solid ${
          medal ? medal.color + "55" : alpha(theme.palette.text.primary, 0.08)
        }`,
        background: isFirst
          ? alpha(theme.palette.secondary.main, 0.05)
          : alpha(theme.palette.background.paper, 0.5),
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          minWidth: isFirst ? "36px" : "28px",
          height: isFirst ? "36px" : "28px",
          borderRadius: "50%",
          border: `2px solid ${medal ? medal.color : "rgba(255,255,255,0.15)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          color: medal ? medal.color : "rgba(255,255,255,0.3)",
        }}
      >
        {rank + 1}
      </div>

      <img
        src={`${API_URL}/${film.url_image}`}
        alt={film.name}
        style={{
          width: isFirst ? "64px" : "48px",
          height: isFirst ? "90px" : "68px",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: isFirst ? "1.05rem" : "0.92rem",
            fontWeight: isFirst ? 700 : 500,
            color: theme.palette.text.primary,
            marginBottom: "6px",
          }}
        >
          {film.name}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "3px",
              background: alpha(theme.palette.text.primary, 0.08),
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background: medal ? medal.color : "#888",
              }}
            />
          </div>

          <span
            style={{
              fontSize: "0.82rem",
              color: medal ? medal.color : "#aaa",
            }}
          >
            {percent}%
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        {SCORES.map((score) => (
          <RatingButton
            key={score.value}
            score={score}
            selected={currentScore === score.value}
            onClick={(val) => onVote(val)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default function Concours() {
  const { user } = useAuth();
  const theme = useTheme();

  const [films, setFilms] = useState([]);
  const [userScores, setUserScores] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserScores = useCallback(
    async (filmsList) => {
      if (!user) return;
      const scores = {};

      await Promise.all(
        filmsList.map(async (film) => {
          try {
            const res = await apiFetch(
              `${API_URL}/scores/protected/getUserScoreForFilm`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ filmId: parseInt(film.id) }),
              },
            );

            if (res.ok) {
              const data = await res.json();
              if (data?.score != null) {
                scores[film.id] = data.score;
              }
            }
          } catch (e) {
            console.error("Erreur récupération vote pour le film : " + film.id, e);
          }
        }),
      );

      setUserScores(scores);
    },
    [user],
  );

  const loadData = useCallback(() => {
    apiFetch(`${API_URL}/films/getAll`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Erreur serveur : ${r.status}`);
        }
        return r.json();
      })
      .then(async (data) => {
        const suggestedFilms = data.filter((f) => f.status === "suggested");
        setFilms(suggestedFilms);
        await fetchUserScores(suggestedFilms);
      })
      .catch((err) => console.error("Erreur chargement films :", err.message))
      .finally(() => setLoading(false));
  }, [fetchUserScores]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const handleVote = async (filmId, score) => {
    if (!user) return;

    // Sauvegarde de l'ancien état local en cas d'échec réseau (Rollback)
    const previousScore = userScores[filmId];

    // Étape 1 : Changement visuel instantané (Mise à jour optimiste)
    setUserScores((prev) => ({
      ...prev,
      [filmId]: score,
    }));

    try {
      // Étape 2 : Enregistrement du score (Attente de la validation serveur)
      await apiFetch(`${API_URL}/scores/protected/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ filmId: parseInt(filmId), score }),
      });

      // Étape 3 : Enregistrement du jeton d'activité de vote
      await apiFetch(`${API_URL}/votes/protected/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ filmId: parseInt(filmId) }),
      });

      // Étape 4 : Récupération des moyennes recalculées côté serveur
      const response = await apiFetch(`${API_URL}/films/getAll`);
      if (response.ok) {
        const data = await response.json();
        setFilms(data.filter((f) => f.status === "suggested"));
      }
    } catch (err) {
      console.error("Erreur lors de la soumission du vote :", err);
      // Remise en place de l'ancienne note si l'API a expiré ou planté
      setUserScores((prev) => ({
        ...prev,
        [filmId]: previousScore,
      }));
    }
  };

  const totalMoyennes = films.reduce(
    (sum, film) => sum + Number(film.moyenne || film.average_score || 0),
    0,
  );

  const sortedFilms = [...films].sort(
    (a, b) =>
      Number(b.moyenne || b.average_score || 0) -
      Number(a.moyenne || a.average_score || 0),
  );

  if (loading) {
    return (
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "80px",
        }}
      >
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className="container">
      <Typography
        variant="h6"
        sx={{
          maxWidth: "700px",
          margin: "0 auto",
          marginBottom: "40px",
          color: "text.secondary",
          textAlign: "center",
          lineHeight: 1.8,
        }}
      >
        <DynamicText role="competition_intro" />
      </Typography>

      {!user && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
            color: theme.palette.text.secondary,
          }}
        >
          Connectez-vous pour voter.
        </div>
      )}

      {sortedFilms.map((film, index) => (
        <FilmRow
          key={film.id}
          film={film}
          rank={index}
          totalMoyennes={totalMoyennes}
          currentScore={userScores[film.id]}
          onVote={(score) => handleVote(film.id, score)}
          disabled={!user}
        />
      ))}
    </div>
  );
}