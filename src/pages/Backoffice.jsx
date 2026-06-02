import { Box, Button, Stack, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Authentification";
import AddCompetition from "../Components/addCompetition";
import EditCompetition from "../Components/editCompetition";
import AddMovie from "../Components/addMovie";
import ModifyTexts from "../Components/modifyTexts";

const API_URL = import.meta.env.VITE_API_URL;

export default function Backoffice() {
  const { user } = useAuth();
  const [view, setView] = useState("menu");
  const [hasCompetition, setHasCompetition] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkCompetition = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/films/getAll`);
      if (response.ok) {
        const films = await response.json();
        const isCompetitionActive = films.some((film) => {
          if (!film.film_genre) return false;
          return film.film_genre
            .split(",")
            .map((g) => g.trim().toLowerCase())
            .includes("concours");
        });
        setHasCompetition(isCompetitionActive);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la compétition :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkCompetition();
  }, [checkCompetition]);

  return (
    <>
      {/* Sécurité : Si l'utilisateur connecté n'est pas ADMIN */}
      {user?.role !== "ADMIN" && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" color="error">Accès restreint</Typography>
          <Typography variant="body1">
            Vous devez être administrateur pour accéder à cette page.
          </Typography>
        </Box>
      )}

      {/* Si l'utilisateur connecté est ADMIN */}
      {user?.role === "ADMIN" && (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {view === "menu" && (
            <Typography variant="h4" mb={6} sx={{ fontWeight: "bold", color: "text.primary" }}>
              Panneau Administration
            </Typography>
          )}

          {view === "menu" && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4} sx={{ justifyContent: "center", alignItems: "center" }}>
              {/* Bouton 1 : Ajouter un film */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setView("addMovie")}
                sx={{ width: "360px", height: "280px", fontSize: "1.2rem", fontWeight: "bold", borderRadius: "16px", textTransform: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
              >
                Ajouter un film
              </Button>

              {/* Bouton 2 : Créer ou Modifier une compétition */}
              <Button
                variant="contained"
                color="secondary"
                disabled={loading}
                onClick={() => setView("competition")}
                sx={{ width: "360px", height: "280px", fontSize: "1.2rem", fontWeight: "bold", borderRadius: "16px", textTransform: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : hasCompetition ? (
                  "Modifier une compétition"
                ) : (
                  "Créer une compétition"
                )}
              </Button>

              {/* Bouton 3 : Modifier les textes du site */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setView("Textes")}
                sx={{ width: "360px", height: "280px", fontSize: "1.2rem", fontWeight: "bold", borderRadius: "16px", textTransform: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
              >
                Modifier les textes du site
              </Button>
            </Stack>
          )}

          {/* VUE 1 : Affichage du composant d'ajout de film */}
          {view === "addMovie" && (
            <Box sx={{ width: "100%" }}>
              <Button variant="outlined" onClick={() => setView("menu")} sx={{ mb: 3 }}>
                ← Retour au menu admin
              </Button>
              <AddMovie />
            </Box>
          )}

          {/* VUE 2 : Affichage dynamique du bon composant concours */}
          {view === "competition" && (
             <Box sx={{ width: "100%" }}>
              <Button variant="outlined" onClick={() => setView("menu")} sx={{ mb: 3 }}>
                ← Retour au menu admin
              </Button>
              {hasCompetition ? (
                <EditCompetition onSaveSuccess={checkCompetition} />
              ) : (
                <AddCompetition onSaveSuccess={checkCompetition} />
              )}
            </Box>
          )}

          {/* VUE 3 : Affichage du composant de modification des textes */}
          {view === "Textes" && (
            <Box sx={{ width: "100%" }}>
              <Button variant="outlined" onClick={() => setView("menu")} sx={{ mb: 3 }}>
                ← Retour au menu admin
              </Button>
              <ModifyTexts />
            </Box>
          )}
        </Box>
      )}
    </>
  );
}