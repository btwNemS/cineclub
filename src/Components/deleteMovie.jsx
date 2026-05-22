import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default function DeleteMovie({ id }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  async function deleteFilm() {
    await fetch(import.meta.env.VITE_API_URL + "/films/protected/delete/" + id, {
      method: "DELETE",
      credentials: "include",
    });
    setOpen(false);
    alert("Film supprimé !");
    navigate(-1);
  }
  
  async function getFilms() {
    const response = await fetch(import.meta.env.VITE_API_URL + "/films/get/" + id);
    const data = await response.json();
    return data;
  }

  return (
    <Box>
      <Button variant="contained" color="error" onClick={handleClickOpen} data-id={id}>
        Supprimer
      </Button>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce film ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={deleteFilm} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}