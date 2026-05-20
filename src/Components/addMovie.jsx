import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function AddMovie() {
  async function postFilm(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    await fetch(import.meta.env.VITE_API_URL, {
      method: "POST",
      credentials: "include",
      body: form,
    });
  }

  return (
    <div>
      <h3>Ajouter un film</h3>
      <form onSubmit={postFilm}>
        <input type="text" name="name" placeholder="Titre du film" />
        <input type="text" name="synopsis" placeholder="Synopsis du film" />
        <input type="file" name="image" />
        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select name="status" label="Status">
            <MenuItem value="suggested">suggeré</MenuItem>
            <MenuItem value="programmed">programmé</MenuItem>
          </Select>
        </FormControl>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}
