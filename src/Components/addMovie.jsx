import { useState } from "react";
import {useNavigate} from "react-router-dom";
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


export default function AddMovie() {
  const [status, setStatus] = useState("");
  const [imageName, setImageName] = useState(null);
  const navigate = useNavigate();

  async function postFilm(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    

    await fetch(import.meta.env.VITE_API_URL + "/films/protected/create", {
      method: "POST",
      credentials: "include",
      body: form,
    });
    alert("Film ajouté !");
  if (status === "programmed") {
    navigate("/filmProgrammed");
  } else {
    navigate("/filmSuggested");
  }
  }

  return (
    <Box sx={{ display: "flex", width: "80%", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 4, margin: "auto", marginBottom: 6 , marginTop: 6}}>
      <Typography variant="h6">Ajouter un film</Typography>
      <Box
        component="form"
        onSubmit={postFilm}
        sx={{ display: "flex", flexDirection: "column", gap: 2 , width: "70%"}}
      >
        <TextField name="name" label="Titre du film" />
        <TextField name="synopsis" label="Synopsis du film" />
        <Button variant="outlined" component="label" color={imageName ? "success" : "primary"}>
          {imageName ?? "Choisir une image"}
          <input type="file" name="image" hidden onChange={(e) => setImageName(e.target.files[0]?.name ?? null)} />
        </Button>
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="suggested">Suggéré</MenuItem>
            <MenuItem value="programmed">Programmé</MenuItem>
          </Select>
        </FormControl>
        {status === "programmed" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="projection_date"
              label="Date de projection"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField name="cinema" label="Cinéma" fullWidth />
          </Box>
        )}
        <TextField name="author" label="Auteur du film" />
        <TextField name="film_genre" label="Genre du film" />
        <TextField name="url_allocine" label="URL Allociné" />
        <TextField name="url_imdb" label="URL IMDb" />
        <TextField name="url_youtube" label="URL YouTube" />
        <Button type="submit" variant="contained">
          Ajouter
        </Button>
      </Box>
    </Box>
  );
}
