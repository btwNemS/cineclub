import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

// Récupération de l'URL de ton API depuis le fichier .env
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  // État pour stocker tous les films de la base de données
  const [films, setFilms] = useState([]);

  // Récupération des films au chargement de la page
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
      })
      .catch((err) => console.error(err));
  }, []);

  // --- DÉFINITION DES STYLES (Selon ta méthode) ---
  const ContainerStyle = {
    textAlign: "center", 
    marginTop: "5vh" 
  };

  const DescriptionStyle = {
    maxWidth: "600px", 
    margin: "0 auto", 
    marginBottom: "40px", 
    color: "#333"
  };

  const SectionContainerStyle = {
    maxWidth: "1100px",
    margin: "50px auto",
    textAlign: "left" // Aligne les titres de section à gauche
  };

  const HeaderRowStyle = {
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "2px solid #ccc",
    paddingBottom: "10px"
  };

  const ButtonStyle = {
    borderRadius: "8px", 
    textTransform: "none"
  };

  return (
    <div className="container" style={ContainerStyle}>
      {/* Titre principal */}
      <h1 className="title">Bienvenue au CinéClub</h1>
      
      {/* Description */}
      <Typography variant="h6" sx={DescriptionStyle}>
        Envie de regarder des films, avec le CinéClub de l'IUT, on te propose plusieurs créneaux de séances de cinéma à faire entre étudiants.
      </Typography>

      {/* --- SECTION 1 : FILMS PRÉVUS --- */}
      <Box sx={SectionContainerStyle}>
        <Box sx={HeaderRowStyle}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
           Films Prévus
          </Typography>
          <Button 
            component={Link} 
            to="/filmProgrammed" 
            variant="contained" 
            color="primary" 
            sx={ButtonStyle}
          >
            Voir plus
          </Button>
        </Box>
        
        {/* Grille de cartes de films  */}
        <div className="films-grid">
          {films
            .filter((film) => film.status === "programmed")
            .slice(0, 6) // Affiche uniquement un aperçu de 6 films maximum sur la ligne
            .map((film) => (
              <Link to={`/film/${film.id}`} key={film.id}>
                <div className="card">
                  <img src={`${API_URL}/${film.url_image}`} alt={film.name} />
                  <div className="card-content">
                    <h2>{film.name}</h2>
                    {film.author && <p><strong>Réalisateur :</strong> {film.author}</p>}
                    {film.film_genre && <p><strong>Genre :</strong> {film.film_genre}</p>}
                    {film.projection_date && (
                      <p><strong>Projection :</strong> {new Date(film.projection_date).toLocaleDateString()}</p>
                    )}
                    {film.cinema && <p><strong>Cinéma :</strong> {film.cinema}</p>}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </Box>

      {/* --- SECTION 2 : FILMS SUGGÉRÉS --- */}
      <Box sx={SectionContainerStyle}>
        <Box sx={HeaderRowStyle}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
           Films Suggérés
          </Typography>
          <Button 
            component={Link} 
            to="/filmSuggested" 
            variant="contained" 
            color="primary" 
            sx={ButtonStyle}
          >
            Voir plus
          </Button>
        </Box>
        
        <div className="films-grid">
          {films
            .filter((film) => film.status === "suggested")
            .slice(0, 3) // Aperçu de 3 films max
            .map((film) => (
              <Link to={`/film/${film.id}`} key={film.id}>
                <div className="card">
                  <img src={`${API_URL}/${film.url_image}`} alt={film.name} />
                  <div className="card-content">
                    <h2>{film.name}</h2>
                    {film.author && <p><strong>Réalisateur :</strong> {film.author}</p>}
                    {film.film_genre && <p><strong>Genre :</strong> {film.film_genre}</p>}
                    {film.cinema && <p><strong>Cinéma :</strong> {film.cinema}</p>}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </Box>

      {/* --- SECTION 3 : FILMS PASSÉS --- */}
      <Box sx={SectionContainerStyle}>
        <Box sx={HeaderRowStyle}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Films passés
          </Typography>
          <Button 
            component={Link} 
            to="/filmPassed" 
            variant="contained" 
            color="primary" 
            sx={ButtonStyle}
          >
            Voir plus
          </Button>
        </Box>
        
        <div className="films-grid">
          {films
            .filter((film) => film.status === "passed")
            .slice(0, 3) // Aperçu de 3 films max
            .map((film) => (
              <Link to={`/film/${film.id}`} key={film.id}>
                <div className="card">
                  <img src={`${API_URL}/${film.url_image}`} alt={film.name} />
                  <div className="card-content">
                    <h2>{film.name}</h2>
                    {film.author && <p><strong>Réalisateur :</strong> {film.author}</p>}
                    {film.film_genre && <p><strong>Genre :</strong> {film.film_genre}</p>}
                    {film.projection_date && (
                      <p><strong>Projection :</strong> {new Date(film.projection_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </Box>
    </div>
  );
}