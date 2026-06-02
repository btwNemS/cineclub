import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InscriptionSeance from "../Components/InscriptionSeance";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Vote from "./Vote";

import MovieIcon from "@mui/icons-material/Movie";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useTheme } from "@mui/material/styles";

import { useAuth } from "../Authentification";
import Comment from "../Comment";
import DeleteMovie from "../Components/deleteMovie";
import EditMovie from "../Components/editMovie";
import YouTubeEmbed from "./LienYoutube";
import imdbLogo from "../images/imdb.png";
import allocineLogo from "../images/allocine.webp";
import { CenterFocusStrong } from "@mui/icons-material";


const API_URL = import.meta.env.VITE_API_URL;

export default function FilmPage() {
  const { id } = useParams();

  const { user } = useAuth();

  const theme = useTheme();

  const [film, setFilm] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

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

    // fetch(`https://rasantacruz.fr/cineclub/posts/get/${id}`)
    //   .then((res) => res.json())
    //   .then((data) => setComments(data));
  }, [id]);

  const sendComment = async () => {
    if (!text.trim()) return;

    const res = await fetch(
      "https://rasantacruz.fr/cineclub/posts/protected/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: text,
          film_id: id,
          answersTo: null,
        }),
      }
    );

    const newComment = await res.json();

    setComments((prev) => [
      ...prev,
      { ...newComment, children: [] },
    ]);

    setText("");
  };

  if (!film) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1100px",
        mx: "auto",
        px: 3,
        py: 5,
      }}
    >
      {film.url_youtube && (
        <Paper
          elevation={4}
          sx={{
            overflow: "hidden",
            borderRadius: 4,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <YouTubeEmbed url={film.url_youtube} />
        </Paper>
      )}

      <Paper
        elevation={4}
        sx={{
          p: 4,
          backgroundColor: "background.paper",
          border: `1px solid rgba(212,175,55,0.15)`,
        }}
      >
<<<<<<< HEAD
        <Stack direction="row" spacing={2} sx= {{alignItems:"center", mb:2, flexWrap:"wrap"}}>
=======
        <Stack direction="row" spacing={2} mb={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
>>>>>>> b90cc76d0866593e0369edacbc359a10087e649d
          <MovieIcon sx={{ color: theme.palette.secondary.main, fontSize: 34 }} />

          <Typography variant="h3" sx={{ color: "text.primary" }}>
            {film.name}
          </Typography>

          {film.film_genre && (
            <Chip label={film.film_genre} color="secondary" variant="outlined" />
          )}
          {film.film_genre &&
            film.film_genre
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean)
              .map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  color="secondary"
                  variant="outlined"
                />
              ))}
        </Stack>
        <Stack>
          <InscriptionSeance />
        </Stack>
        <Vote filmId={id} />

        <Stack direction="row" spacing={2} mb={4} sx={{ flexWrap: "wrap" }}>
          {film.url_imdb && (
            <Button
              variant="outlined"
              color="secondary"
              href={film.url_imdb}
              target="_blank"
              endIcon={<OpenInNewIcon />}
            >
              IMDb
            </Button>
          )}

          {film.url_allocine && (
            <Button
              variant="outlined"
              color="secondary"
              href={film.url_allocine}
              target="_blank"
              endIcon={<OpenInNewIcon />}
            >
              Allociné
            </Button>
          )}
        </Stack>

        <Stack spacing={2}>
          {film.author && (
            <Typography variant="body1">
              <Box component="span" sx={{ color: theme.palette.secondary.main, fontWeight: 700 }}>
                Réalisateur :
              </Box>{" "}
              {film.author}
            </Typography>
          )}

          {film.synopsis && (
            <Typography variant="body1" sx={{ lineHeight: 1.9, color: "text.secondary" }}>
              {film.synopsis}
            </Typography>
          )}

          {film.projection_date && (
            <Typography variant="body1">
              <Box component="span" sx={{ color: theme.palette.secondary.main, fontWeight: 700 }}>
                Projection :
              </Box>{" "}
              {new Date(film.projection_date).toLocaleDateString()}
            </Typography>
          )}

          {film.cinema && (
            <Typography variant="body1">
              <Box component="span" sx={{ color: theme.palette.secondary.main, fontWeight: 700 }}>
                Cinéma :
              </Box>{" "}
              {film.cinema}
            </Typography>
          )}
        </Stack>

        <Box sx={{ mt: 5 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: theme.palette.secondary.main,
              fontWeight: 700,
            }}
          >
            Commentaires
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ajouter un commentaire..."
            />

            <Button variant="contained" onClick={sendComment}>
              Envoyer
            </Button>
          </Stack>

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
        </Box>

        {user?.role === "ADMIN" && (
          <Box sx={{ mt: 4  }}>
            <DeleteMovie id={id} />
            <EditMovie id={id} /> 
          </Box>
        )}
      </Paper>
    </Box>
  );
}