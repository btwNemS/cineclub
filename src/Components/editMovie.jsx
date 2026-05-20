import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function EditMovie() {
  const putFilm = async (e) => {
    e.preventDefault();
    const form = new FormData();
    await fetch("https://rasantacruz.fr/cineclub/films/protected/update/12", {
      method: "PUT",
      credentials: "include",
      body: form,
    });
  };
  return (
    <div>
      <h3>Modifier un film</h3>
    </div>
  );
}
