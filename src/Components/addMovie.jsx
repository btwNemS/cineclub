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
    // validation: ensure an image file was chosen and is of an allowed image type
    const file = e.target.elements.image?.files?.[0];
    if (!file) {
      alert("Veuillez sélectionner une image pour l'affiche du film.");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg, image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Le fichier sélectionné doit être une image (jpg, png, webp, jpeg).");
      return;
    }

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
        <TextField name="name" label="Titre du film" required />
        <TextField name="synopsis" label="Synopsis du film" required />
        <Button variant="outlined" component="label" color={imageName ? "success" : "primary"} required>
          {imageName ?? "Choisir une image"}
          <input type="file" accept=".jpg,.jpeg,.png,.webp" name="image" hidden onChange={(e) => setImageName(e.target.files[0]?.name ?? null)} required/>
        </Button>
        <FormControl required>
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
            required/>
            <TextField name="cinema" label="Cinéma" fullWidth required />
          </Box>
        )}
        <TextField name="author" label="Auteur du film"  />
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
