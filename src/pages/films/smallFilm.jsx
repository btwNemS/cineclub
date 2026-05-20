import { useFilms } from "./useFilms";

const API_URL = import.meta.env.VITE_API_URL;

export default function SmallFilm() {
  const { films, loading, error } = useFilms();

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  return (
    <div className="container">
      <h1 className="title">Films prévus</h1>

      {films.map((film) => (
        <div className="card" key={film.id}>
          <img
            src={`${API_URL}/${film.url_image}`}
            alt={film.name}
          />

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
                {new Date(
                  film.projection_date
                ).toLocaleDateString()}
              </p>
            )}

            {film.cinema && (
              <p>
                <strong>Cinéma :</strong> {film.cinema}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}