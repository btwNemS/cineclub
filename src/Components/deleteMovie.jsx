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
} from "@mui/material";

export default function DeleteMovie({ id }) {
  const navigate = useNavigate();

  async function deleteFilm(e) {
    e.preventDefault();
    await fetch(import.meta.env.VITE_API_URL + "/films/protected/delete/" + e.target.dataset.id, {
      method: "DELETE",
      credentials: "include",
    });
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
      <Button variant="contained" color="error" onClick={deleteFilm} data-id={id}>
        Supprimer
      </Button>
    </Box>
  );
}