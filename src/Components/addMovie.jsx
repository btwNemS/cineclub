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
  async function postFilm(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    await fetch(import.meta.env.VITE_API_URL + "/films/protected/create", {
      method: "POST",
      credentials: "include",
      body: form,
    });
  }

  return (
    <Box sx={{ display: "flex", width: "80%", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 4, margin: "auto" }}>
      <Typography variant="h6">Ajouter un film</Typography>
      <Box
        component="form"
        onSubmit={postFilm}
        sx={{ display: "flex", flexDirection: "column", gap: 2 , width: "70%"}}
      >
        <TextField name="name" label="Titre du film" />
        <TextField name="synopsis" label="Synopsis du film" />
        <Button variant="outlined" component="label">
          Choisir une image
          <input type="file" name="image" hidden />
        </Button>
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select name="status" label="Status">
            <MenuItem value="suggested">Suggéré</MenuItem>
            <MenuItem value="programmed">Programmé</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained">
          Ajouter
        </Button>
      </Box>
    </Box>
  );
}
