import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function EditMovie() {
  async function putFilm(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    await fetch(import.meta.env.VITE_API_URL, {
      method: "PUT",
      credentials: "include",
      body: form,
    });
  }
  return (
    <div>
      <h3>Modifier un film</h3>
    </div>
  );
}
