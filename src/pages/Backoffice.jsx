import React, { useState } from 'react';
import { Typography, Box, Button, Stack } from '@mui/material';
import AddMovie from "../Components/addMovie";
import AddCompetition from '../Components/addCompetition';
// import AddCompetition from "../Components/AddCompetition"; // Ton composant concours page blanche
import { useAuth } from "../Authentification";

export default function Backoffice() {
  const { user } = useAuth();

  // 'view' contrôle l'affichage de la zone : "menu", "addMovie", ou "competition"
  const [view, setView] = useState("menu");

  const [hasCompetition, setHasCompetition] = useState(false);

  return (
    <>
      {/* Sécurité : Si l'utilisateur connecté n'est pas ADMIN */}
      {user?.role !== "ADMIN" && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" color="error">
            Accès restreint
          </Typography>
          <Typography variant="body1">
            Vous devez être administrateur pour accéder à cette page.
          </Typography>
        </Box>
      )}

      {/* Si l'utilisateur connecté est ADMIN */}
      {user?.role === "ADMIN" && (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {view === "menu" && (
            <Typography variant="h4" mb={6} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
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
                sx={{
                  width: "360px",
                  height: "280px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  borderRadius: "16px",
                  textTransform: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                }}
              >
                Ajouter un film
              </Button>

              {/* Bouton 2 : Créer ou Modifier une compétition */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setView("competition")}
                sx={{
                  width: "360px",
                  height: "280px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  borderRadius: "16px",
                  textTransform: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                }}
              >
                {hasCompetition ? "Modifier une compet" : "Créer une compétition"}
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

          {/* VUE 2 : Affichage du composant concours (Page blanche) */}
          {view === "competition" && (
            <AddCompetition onBack={() => setView("menu")} />
          )}

        </Box>
      )}
    </>
  );
}