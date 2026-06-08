import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "./Authentification";

export default function AuthModal({ open, handleClose }) {
  const { login, signin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Champs de saisie
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(pseudo, password);
    } else {
      await signin(email, pseudo, password);
    }
    handleClose(); // Ferme la modale après action
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper", // S'adapte dynamiquement (Blanc en clair, Bleu nuit en sombre)
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          mb={3} 
          textAlign="center"
          sx={{ 
            fontWeight: "bold",
            color: "text.primary" // Noir/bleu en clair, blanc crème en sombre
          }}
        >
          {isLogin ? "CONNEXION" : "INSCRIPTION"}
        </Typography>

        <form onSubmit={handleSubmit}>
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
                // L'animation MUI décale le label en haut; on lui donne la couleur secondaire (dorée) lors du focus
                "& .MuiInputLabel-root.Mui-focused": { color: "secondary.main" }, 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "divider" }, 
                  "&:hover fieldset": { borderColor: "text.secondary" },
                  "&.Mui-focused fieldset": { borderColor: "secondary.main", borderWidth: "2px" },
                },
              }}
            />
          )}

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

          <Button
            type="submit"
            variant="contained"
            color="secondary" // Utilise le bouton jaune/doré du thème
            fullWidth
            sx={{ mt: 3, mb: 2, fontWeight: "bold" }}
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </Button>
        </form>

        <Box textAlign="center" sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            onClick={() => setIsLogin(!isLogin)}
            sx={{ 
              color: "text.secondary", 
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": { color: "secondary.main" }, 
              transition: "color 0.2s"
            }}
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}