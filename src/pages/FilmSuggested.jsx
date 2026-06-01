import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardMovie from "../Components/cardMovie";

const API_URL = import.meta.env.VITE_API_URL;

export default function FilmSuggested() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/films/getAll`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des films");
        }

        return res.json();
      })
      .then((data) => {
        setFilms(data);
      });
  }, []);

  return (

    <div className="container">
      <h1 className="title">Films suggérés</h1>

      <div className="films-grid">
        {films
          .filter((film) => film.status === "suggested")
          .map((film) => (
            <Link to={`/film/${film.id}`} key={film.id}>
              <CardMovie film={film} />
            </Link>
          ))}
      </div>
    </div>
  );
}
