import { FormControl, InputLabel, Select, MenuItem, Alert, AlertTitle } from "@mui/material";

export default function EditMovie() {
  async function putFilm(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    await fetch(
      import.meta.env.VITE_API_URL +
        "/films/protected/update/" +
        e.target.dataset.id,
      {
        method: "PUT",
        credentials: "include",
        body: form,
      },
    );
  }
  return (
    <div>
      <h3>Modifier un film</h3>
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        Vous êtes sur le point de modifier un film.
      </Alert>
      <form data-id="1" onSubmit={putFilm}></form>
    </div>
  );
}
