import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../Authentification";
import AddMovie from "../Components/addMovie";
import ModifyTexts from "../Components/modifyTexts";

export default function Backoffice() {
  const { user } = useAuth();
  const [view, setView] = useState("menu");

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

              {/* Bouton 2 : Modifier les textes du site */}
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
              <Button variant="outlined" onClick={() => setView("menu")}>
                ← Retour au menu admin
              </Button>
              <AddMovie />
            </Box>
          )}

          {/* VUE 2 : Affichage du composant de modification des textes */}
          {view === "Textes" && (
            <Box sx={{ width: "100%" }}>
              <Button variant="outlined" color="primary" onClick={() => setView("menu")} sx={{ mb: 3 }}>
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