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
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h2" mb={2} textAlign="center">
          {isLogin ? "Connexion" : "Inscription"}
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
                "& .MuiInputBase-input": { color: "#ffffff" },
                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "#ffffff", borderWidth: "1px" },
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
              "& .MuiInputBase-input": { color: "#ffffff" },
              "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "transparent",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#ffffff", borderWidth: "1px" },
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
              "& .MuiInputBase-input": { color: "#ffffff" },
              "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#ffffff" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "transparent",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#ffffff", borderWidth: "1px" },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </Button>
        </form>

        <Box textAlign="center" sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            color="primary"
            onClick={() => setIsLogin(!isLogin)}
            sx={{ color: "#ffffff !important", cursor: "pointer" }}
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}