import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import YouTubeEmbed from "./LienYoutube";
import DeleteMovie from "../Components/deleteMovie";
import { useAuth } from '../Authentification';
import Comment from "../Comment";

const API_URL = import.meta.env.VITE_API_URL;

export default function FilmPage() {
  const { id } = useParams();
  const { user, logout } = useAuth(); 
  const [film, setFilm] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/films/get/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement du film");
        }

        return res.json();
      })
      .then((data) => {
        setFilm(data);
      });
      fetch(`https://rasantacruz.fr/cineclub/posts/get/${id}`)
     .then((res) => res.json())
     .then((data) => setComments(data));

  }, [id]);

  if (!film) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="container2">
      <img src={`${API_URL}/${film.url_image}`} alt={film.name} />
    
        {film.url_youtube && (
          <div className="video">
            <YouTubeEmbed className="video" url={film.url_youtube} />
            </div>
          )}

      
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
        </div>
          
        
      

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

        {film.synopsis && <p>{film.synopsis}</p>}

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


      <h3>Commentaires</h3>

{comments.map((post) => (
  <Comment
    key={post.id}
    content={post.content}
    children={post.children}
    level={0}
    post={post}
    filmId={id}
    setComments={setComments}
  />
))}


        
        <DeleteMovie id={id} />

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
            <YouTubeEmbed url={film.url_youtube} />
          )}
        </div>
        {user && user.role === 'ADMIN' && (
          <DeleteMovie id={id} />
        )}

      </div>
    </div>
  );
}
