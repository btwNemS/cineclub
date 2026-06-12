import { Alert, Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./Authentification"; // Importation du hook personnalisé pour gérer l'état global d'authentification

export default function AuthModal({ open, handleClose }) {
  // Extraction des fonctions de connexion et d'inscription depuis le contexte d'authentification
  const { login, signin, authModalMessage } = useAuth();
  
  // État local pour savoir si on affiche le formulaire de connexion (true) ou d'inscription (false)
  const [isLogin, setIsLogin] = useState(true);

  // États locaux pour stocker la valeur des différents champs de saisie du formulaire
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fonction déclenchée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement par défaut de la page
    
    // Appel de la fonction appropriée selon le mode actuel (connexion ou inscription)
    if (isLogin) {
      await login(pseudo, password);
    } else {
      await signin(email, pseudo, password);
    }
    
    handleClose(); // Ferme automatiquement la modale une fois l'action terminée
  };

  return (
    // Composant de fenêtre modale MUI. Gère l'affichage (open) et la fermeture au clic à l'extérieur (onClose)
    <Modal open={open} onClose={handleClose}>
      {/* Conteneur principal de la modale stylisé pour être centré au milieu de l'écran */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Centrage parfait
          width: 400,
          bgcolor: "background.paper", // Couleur de fond adaptative (ex: blanc en clair, sombre en mode nuit)
          boxShadow: 24, // Ombre portée pour donner du relief
          p: 4, // Padding (marge interne)
          borderRadius: 2, // Coins arrondis
        }}
      >
        {/* Titre dynamique de la modale (CONNEXION ou INSCRIPTION) */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: "bold",
            color: "text.primary", // Noir/bleu en clair, blanc crème en sombre
            textAlign: "center",
            mb: 3,
          }}
        >
          {isLogin ? "CONNEXION" : "INSCRIPTION"}
        </Typography>

        {authModalMessage && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {authModalMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* AFFICHAGE CONDITIONNEL : Le champ Email ne s'affiche que si 'isLogin' est faux (donc en mode Inscription) */}
          {!isLogin && (
            <TextField
              label="Email *"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Met à jour l'état de l'email
              sx={{
                "& .MuiInputBase-input": { color: "text.primary" }, 
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInputLabel-root.Mui-focused": { color: "secondary.main" }, // Devient doré/jaune au focus
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "divider" }, 
                  "&:hover fieldset": { borderColor: "text.secondary" },
                  "&.Mui-focused fieldset": { borderColor: "secondary.main", borderWidth: "2px" }, // Bordure dorée plus épaisse au focus
                },
              }}
            />
          )}

          {/* Champ de saisie pour le Pseudo (commun aux deux modes) */}
          <TextField
            label="Pseudo *"
            variant="outlined"
            fullWidth
            margin="normal"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)} // Met à jour l'état du pseudo
            sx={{
              "& .MuiInputBase-input": { color: "text.primary" }, 
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputLabel-root.Mui-focused": { color: "secondary.main" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "text.secondary" },
                "&.Mui-focused fieldset": { borderColor: "secondary.main", borderWidth: "2px" },
              },
            }}
          />

          {/* Champ de saisie pour le Mot de passe (commun aux deux modes) */}
          <TextField
            label="Mot de passe *"
            type="password" // Masque les caractères saisis
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Met à jour l'état du mot de passe
            sx={{
              "& .MuiInputBase-input": { color: "text.primary" }, 
              "& .MuiInputLabel-root": { color: "text.secondary" },
              "& .MuiInputLabel-root.Mui-focused": { color: "secondary.main" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "text.secondary" },
                "&.Mui-focused fieldset": { borderColor: "secondary.main", borderWidth: "2px" },
              },
            }}
          />

          {/* Bouton de validation dont le texte s'adapte au mode choisi */}
          <Button
            type="submit"
            variant="contained"
            color="secondary" // Utilise la couleur secondaire définie dans le thème MUI
            fullWidth
            sx={{ mt: 3, mb: 2, fontWeight: "bold" }}
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </Button>
        </form>

        {/* Section en bas de la modale permettant de basculer entre Connexion et Inscription */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography
            variant="body2"
            onClick={() => setIsLogin(!isLogin)} // Inverse la valeur de 'isLogin' au clic
            sx={{ 
              color: "text.secondary", 
              cursor: "pointer", // Curseur en forme de main au survol
              textDecoration: "underline", // Texte souligné comme un lien hypertexte
              "&:hover": { color: "secondary.main" }, 
              transition: "color 0.2s" // Effet de transition fluide sur le changement de couleur
            }}
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}