import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";

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
      max={3} // <- seulement 3 icônes
      defaultValue={2}
      getLabelText={(value) => customIcons[value].label}
      slotProps={{ icon: { component: IconContainer } }}
      highlightSelectedOnly
    />
  );
}

export default function Concours() {
  return <RadioGroupRating />;
}
