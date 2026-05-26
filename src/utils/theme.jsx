// utils/theme.jsx

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#202349",
      light: "#343A73",
      dark: "#161836",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#D4AF37",
      light: "#E6C65C",
      dark: "#B8921F",
      contrastText: "#202349",
    },

    error: {
      main: "#C44536",
    },

    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#202349",
      secondary: "#5F647A",
    },

    divider: "rgba(32,35,73,0.12)",
  },

  typography: {
    fontFamily: `"Inter", "Roboto", sans-serif`,

    h1: {
      fontWeight: 700,
      letterSpacing: "-0.03em",
      color: "#202349",
    },

    h2: {
      fontWeight: 700,
      color: "#202349",
    },

    h3: {
      fontWeight: 600,
      color: "#202349",
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
          background: "#202349",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",

          border: "1px solid rgba(32,35,73,0.08)",

          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",

          transition: "0.2s ease",

          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "#202349",
          color: "#FFFFFF",

          "&:hover": {
            background: "#343A73",
          },
        },

        containedSecondary: {
          background: "#D4AF37",
          color: "#202349",

          "&:hover": {
            background: "#E6C65C",
          },
        },

        outlinedPrimary: {
          borderColor: "#202349",
          color: "#202349",

          "&:hover": {
            background: "rgba(32,35,73,0.04)",
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
