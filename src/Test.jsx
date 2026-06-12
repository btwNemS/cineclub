import { useEffect, useState } from "react";
import apiFetch from "./Components/tokencheck";

const API_URL = import.meta.env.VITE_API_URL;

export default function Test() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    apiFetch(`${API_URL}/films/getAll`)
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
        {films.map((film) => (
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

              {film.synopsis && <p className="synopsis">{film.synopsis}</p>}

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

              <div className="links">
                {film.url_imdb && (
                  <a href={film.url_imdb} target="_blank" rel="noreferrer">
                    IMDb
                  </a>
                )}

                {film.url_allocine && (
                  <a href={film.url_allocine} target="_blank" rel="noreferrer">
                    Allociné
                  </a>
                )}

                {film.url_youtube && (
                  <a href={film.url_youtube} target="_blank" rel="noreferrer">
                    Bande-annonce
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
