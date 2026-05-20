import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function FilmPassed() {
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
      <h1 className="title">CinéClub</h1>

      <div className="films-grid">
        {films
  .filter((film) => film.status === "passed")
  .map((film) => (
          <div className="card" key={film.id}>
            <img src={`${API_URL}/${film.url_image}`} alt={film.name} />
            <div className="card-content">
              <h2>{film.name}</h2>

              {film.author && (
                <p>
                  <strong>Réalisateur :</strong> {film.author}
                </p>
              )}

              {film.film_genre && (
                <p>
                  <strong>Genre :</strong> {film.film_genre}
                </p>
              )}

             

              {film.projection_date && (
                <p>
                  <strong>Projection :</strong>{" "}
                  {new Date(film.projection_date).toLocaleDateString()}
                </p>
              )}

              {film.cinema && (
                <p>
                  <strong>Cinéma :</strong> {film.cinema}
                </p>
              )}

              <p>
                <strong>Status :</strong> {film.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
