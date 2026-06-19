import { Alert, Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./Authentification"; // Hook pour accéder à login/signin et au contexte d'auth

export default function AuthModal({ open, handleClose }) {
  const { login, signin, authModalMessage } = useAuth();

  // true = formulaire de connexion affiché, false = formulaire d'inscription
  const [isLogin, setIsLogin] = useState(true);

  // Valeurs des champs du formulaire, contrôlées par React (controlled inputs)
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de page par défaut d'un <form>

    if (isLogin) {
      await login(pseudo, password);
    } else {
      await signin(email, pseudo, password);
    }

    handleClose(); // ferme la modale une fois l'action terminée
  };

  return (
    // Modale MUI : visible si open=true, se ferme au clic extérieur via onClose
    <Modal open={open} onClose={handleClose}>
      {/* Carte centrée au milieu de l'écran */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Titre qui change selon le mode connexion/inscription */}
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: "bold", color: "text.primary", textAlign: "center", mb: 3 }}
        >
          {isLogin ? "CONNEXION" : "INSCRIPTION"}
        </Typography>

        {/* Message d'avertissement (ex: session expirée), affiché seulement s'il existe */}
        {authModalMessage && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {authModalMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Champ Email visible uniquement en mode inscription */}
          {!isLogin && (
            <TextField
              label="Email *"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          )}

          {/* Pseudo, commun aux deux modes */}
          <TextField
            label="Pseudo *"
            variant="outlined"
            fullWidth
            margin="normal"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
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

          {/* Mot de passe, commun aux deux modes */}
          <TextField
            label="Mot de passe *"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          {/* Le texte du bouton s'adapte au mode choisi */}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 3, mb: 2, fontWeight: "bold" }}
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </Button>
        </form>

        {/* Lien pour basculer entre connexion et inscription */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography
            variant="body2"
            onClick={() => setIsLogin(!isLogin)}
            sx={{
              color: "text.secondary",
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": { color: "secondary.main" },
              transition: "color 0.2s",
            }}
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}