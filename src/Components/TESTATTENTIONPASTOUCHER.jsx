import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ConcoursSelector() {
  const [films, setFilms] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/films/getAll`)
      .then((res) => res.json())
      .then((data) =>
        setFilms(data.filter((film) => film.status === "suggested")),
      )
      .catch(console.error);
  }, []);

  return (
    <div className="concours-selector">
      <button className="plus-button" onClick={() => setOpen(!open)}>
        +
      </button>

      {open && (
        <div className="film-list">
          {films.map((film) => (
            <div key={film.id} className="film-item">
              {film.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
