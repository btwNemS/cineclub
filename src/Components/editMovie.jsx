import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const API_URL = import.meta.env.VITE_API_URL;

// Formate une date au format attendu par un input datetime-local
// (YYYY-MM-DDTHH:mm), en heure locale et non en UTC
function toDatetimeLocal(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditMovie({ id }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [film, setFilm] = useState(null);
  const [status, setStatus] = useState("");
  const [genres, setGenres] = useState([]);
  const [imageName, setImageName] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger les données du film quand la modale s'ouvre
  useEffect(() => {
    if (!open) return;
    setFeedback(null);
    setImageName(null);
    fetch(`${API_URL}/films/get/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFilm(data);
        setStatus(data.status ?? "");
        setGenres(
          data.film_genre
            ? data.film_genre.split(",").map((g) => g.trim()).filter(Boolean)
            : []
        );
      });
  }, [open, id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFilm(null);
  };

  async function putFilm(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const form = new FormData(e.target);

    form.set("film_genre", genres.join(","));

    // Si aucune nouvelle image n'est sélectionnée, retirer le champ du FormData
    const imageFile = form.get("image");
    if (!imageFile || imageFile.size === 0) {
      form.delete("image");
    }

    try {
      const response = await fetch(`${API_URL}/films/protected/update/${id}`, {
        method: "PUT",
        credentials: "include",
        body: form,
      });

      if (!response.ok) {
        setFeedback({ severity: "error", message: "Erreur lors de la modification du film. Veuillez réessayer." });
        return;
      }

      setFeedback({ severity: "success", message: "Film modifié avec succès !" });
      setTimeout(() => {
        handleClose();
        navigate(0); // Recharge la page pour afficher les nouvelles données
      }, 1200);
    } catch {
      setFeedback({ severity: "error", message: "Impossible de contacter le serveur." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ display: "inline-block", mt: 3}}>
      <Button
        variant="contained"
        color="warning"
        startIcon={<EditIcon />}
        onClick={handleOpen}
      >
        Modifier
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le film</DialogTitle>

        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Info</AlertTitle>
            Vous êtes sur le point de modifier ce film.
          </Alert>

          {feedback && (
            <Alert severity={feedback.severity} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
              <AlertTitle>
                {feedback.severity === "success" && "Succès"}
                {feedback.severity === "error" && "Erreur"}
              </AlertTitle>
              {feedback.message}
            </Alert>
          )}

          {!film ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              component="form"
              id="edit-movie-form"
              onSubmit={putFilm}
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                name="name"
                label="Titre du film"
                defaultValue={film.name ?? ""}
                required
                fullWidth
              />
              <TextField
                name="synopsis"
                label="Synopsis du film"
                defaultValue={film.synopsis ?? ""}
                multiline
                minRows={3}
                required
                fullWidth
              />

              <Button
                variant="outlined"
                component="label"
                color={imageName ? "success" : "primary"}
              >
                {imageName ?? "Changer l'affiche (optionnel)"}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  name="image"
                  hidden
                  onChange={(e) => setImageName(e.target.files[0]?.name ?? null)}
                />
              </Button>

              <FormControl required fullWidth>
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
                    label="Date et heure de projection"
                    type="datetime-local"
                    defaultValue={
                      film.projection_date
                        ? toDatetimeLocal(film.projection_date)
                        : ""
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    required
                  />
                  <TextField
                    name="cinema"
                    label="Cinéma"
                    defaultValue={film.cinema ?? ""}
                    fullWidth
                    required
                  />
                </Box>
              )}

              <TextField
                name="author"
                label="Réalisateur"
                defaultValue={film.author ?? ""}
                fullWidth
              />
              <Autocomplete
                multiple
                freeSolo
                options={["Action", "Comédie", "Drame", "Thriller", "Horreur", "Science-Fiction", "Romance", "Animation", "Documentaire", "Aventure"]}
                value={genres}
                onChange={(_, newValue) => setGenres(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      label={option}
                      {...getTagProps({ index })}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Genres du film"
                    placeholder={genres.length === 0 ? "Taper et appuyer sur Entrée…" : ""}
                  />
                )}
              />
              <TextField
                name="url_allocine"
                label="URL Allociné"
                defaultValue={film.url_allocine ?? ""}
                fullWidth
              />
              <TextField
                name="url_imdb"
                label="URL IMDb"
                defaultValue={film.url_imdb ?? ""}
                fullWidth
              />
              <TextField
                name="url_youtube"
                label="URL YouTube"
                defaultValue={film.url_youtube ?? ""}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            form="edit-movie-form"
            variant="contained"
            color="warning"
            disabled={loading || !film}
          >
            {loading ? <CircularProgress size={20} /> : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
