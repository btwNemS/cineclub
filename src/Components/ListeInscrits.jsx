import { useTheme } from "@mui/material/styles";
import Divider from '@mui/material/Divider';

export default function ListeInscrits({ liste, hovered }) {
  const theme = useTheme();
  const opacity = hovered ? 1 : 0;

  const style = {
    backgroundColor: theme.palette.background.paper,
    opacity: opacity,
    border: "0.9px solid " + theme.palette.divider,
    borderRadius: "10px",
    pointerEvents: "none",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    zIndex: "1",
    position: "absolute"
  };

  const style2 = {
    padding: "12px 16px",
  };

  return (
    <div style={style}>
      {liste.map((inscrit, index) => (
        <div key={inscrit.id || index}>
          <div style={style2}>
            {inscrit.pseudo}
          </div>
          {index < liste.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
}