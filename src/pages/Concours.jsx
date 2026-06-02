import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import DynamicText from "../Components/dymanicText";
const API_URL = import.meta.env.VITE_API_URL;

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: (theme.vars || theme).palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Insatisfait",
  },
  2: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutre",
  },
  3: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Satisfait",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

function RadioGroupRating() {
  return (
    <StyledRating
      name="rating"
      max={3}
      defaultValue={2}
      getLabelText={(value) => customIcons[value].label}
      slotProps={{ icon: { component: IconContainer } }}
      highlightSelectedOnly
    />
  );
}

export default function Concours() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/films/getAll`)
      .then((res) => res.json())
      .then((data) => {
        const concoursFilms = data.filter(
          (film) =>
            film.film_genre &&
            film.film_genre.toLowerCase().includes("concours"),
        );

        setFilms(concoursFilms);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <Typography
        variant="h6"
        sx={{
          maxWidth: "700px",
          margin: "0 auto",
          marginBottom: "60px",

          color: "text.secondary",

          textAlign: "center",
          lineHeight: 1.8,
        }}
      >
        <DynamicText role="competition_intro" />
      </Typography>

      <div className="films-grid">
        {films.map((film) => (
          <div key={film.id} className="film-card">
            <img
              src={`${API_URL}/uploads/${film.image}`}
              alt={film.name}
              className="film-image"
            />

            <Typography variant="h3">{film.name}</Typography>

            <RadioGroupRating />
          </div>
        ))}
      </div>
    </div>
  );
}
