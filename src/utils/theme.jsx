// utils/theme.jsx
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // Bascule indispensable pour l'ambiance cinéma de la maquette
    primary: {
      main: "#111424", // Ton bleu nuit très sombre pour la nav bar et les fonds principaux
      light: "#343A73",
      dark: "#0B0E1A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#D4AF37", // Ton doré conservé et mis en valeur
      light: "#E6C65C",
      dark: "#B8921F",
      contrastText: "#202349",
    },
    error: {
      main: "#C44536",
    },
    background: {
      default: "#0B0E1A", // Fond global de l'application très sombre
      paper: "#111424",   // Fond des cartes et des blocs
    },
    text: {
      primary: "#F5F1E8",   // Blanc crème pour une lecture douce sur fond sombre
      secondary: "#A2A7BD", // Gris bleuté pour les textes secondaires
    },
    divider: "rgba(212,175,55,0.15)", // Lignes de séparation aux reflets dorés discrets
  },
  typography: {
    fontFamily: `"Inter", "Roboto", sans-serif`,

    h1: {
      fontWeight: 700,
      letterSpacing: "-0.03em",
      color: "#D4AF37",
    },
    h2: {
      fontWeight: 700,
      color: "#F5F1E8",
    },
    h3: {
      fontWeight: 600,
      color: "#F5F1E8",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#111424",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#111424",
          border: "1px solid rgba(212, 175, 55, 0.08)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          transition: "0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 32px rgba(212, 175, 55, 0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "#111424",
          color: "#FFFFFF",
          "&:hover": {
            background: "#1A1F36",
          },
        },
        containedSecondary: {
          background: "#D4AF37",
          color: "#111424",
          "&:hover": {
            background: "#E6C65C",
          },
        },
        outlinedPrimary: {
          borderColor: "#D4AF37",
          color: "#D4AF37",
          "&:hover": {
            background: "rgba(212, 175, 55, 0.04)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;