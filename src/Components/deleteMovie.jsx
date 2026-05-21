import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function DeleteMovie() {
  async function deleteFilm(e) {
    e.preventDefault();
    await fetch(import.meta.env.VITE_API_URL + "/films/protected/delete/" + e.target.dataset.id, {
      method: "DELETE",
      credentials: "include",
    });
  }
  
  async function getFilms() {
    const response = await fetch(import.meta.env.VITE_API_URL + "/films/get/:id");
    const data = await response.json();
    return data;
  }

  return (
    <Box>
      <Typography variant="h6">Supprimer un film</Typography>
      <TextField name="name" label="Titre du film" />
      <Button variant="contained" color="error" onClick={deleteFilm}>
        Supprimer
      </Button>
    </Box>
  );
}