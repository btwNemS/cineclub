import { useEffect, useState } from "react";
import CardMovie from "../Components/cardMovie";

const API_URL = import.meta.env.VITE_API_URL;

export default function FilmSuggested() {
  const [films, setFilms] = useState([]);

  const refreshFilms = () => {
    fetch(`${API_URL}/films/getAll`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => setFilms(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    refreshFilms();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Films suggérés</h1>

      <div className="films-grid">
        {films
          .filter((film) => film.status === "suggested")
          .map((film) => (
            // Plus de composant <Link> encombrant ici ! C'est CardMovie qui gère ses zones.
            <CardMovie 
              key={film.id} 
              film={film} 
              onVoteSuccess={refreshFilms} 
            />
          ))}
      </div>
    </div>
  );
}