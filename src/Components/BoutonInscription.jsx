import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../Authentification";
import { useState } from "react";
export default function BoutonInscription({
  refreshListe,
  isSuscribed,
  id,
  API_URL,
  setHovered,
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = async () => {
    if (!user) {
      setOpen(true);
      return;
    }
    else {
      try {
        if (!isSuscribed) {
          await fetch(`${API_URL}/registrations/protected/create/${id}`, {
            method: "POST",
            credentials: "include",
          });
          refreshListe();
        } else {
          await fetch(`${API_URL}/registrations/protected/delete/${id}`, {
            method: "POST",
            credentials: "include",
          });
          refreshListe();
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'inscription:", error);
      }
    }

  };

  function handleHover() {
    setHovered(true);
  }

  function handleHoverOut() {
    setHovered(false);
  }

  return (
    <div>
      <Button
        id="boutonInscription"
        variant="outlined"
        color="secondary"
        onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverOut}
      >
        {isSuscribed ? "Se désinscrire" : "S'inscrire"}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Veuillez vous connecter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vous devez vous connecter pour pouvoir inscrire.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
