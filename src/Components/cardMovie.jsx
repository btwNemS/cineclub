const API_URL = import.meta.env.VITE_API_URL;

export default function CardMovie({ film }) {
    if (!film) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="card">
            <img
                src={`${API_URL}/${film.url_image}`}
                alt={film.name}
                className="image"
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
                      {new Date(film.projection_date).toLocaleDateString()}
                    </p>
                  )}

                  {film.cinema && (
                    <p>
                      <strong>Cinéma :</strong> {film.cinema}
                    </p>
                  )}
                </div>
              </div>

    );}
