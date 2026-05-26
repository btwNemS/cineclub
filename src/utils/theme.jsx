// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#202349",
      light: "#343A73",
      dark: "#161836",
      contrastText: "#F5F1E8",
    },

    secondary: {
      main: "#D4AF37", // or cinéma
      light: "#E6C65C",
      dark: "#B8921F",
      contrastText: "#202349",
    },

    error: {
      main: "#C44536",
    },

    background: {
      default: "#121212",
      paper: "#1B1F3B",
    },

    text: {
      primary: "#F5F1E8",
      secondary: "#C9C6BE",
    },

    divider: "rgba(255,255,255,0.08)",
  },

  typography: {
    fontFamily: `"Inter", "Roboto", sans-serif`,

    h1: {
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 600,
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
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1B1F3B",
          border: "1px solid rgba(212,175,55,0.15)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "#D4AF37",
          color: "#202349",

          "&:hover": {
            background: "#E6C65C",
          },
        },

        outlinedPrimary: {
          borderColor: "#D4AF37",
          color: "#D4AF37",

          "&:hover": {
            borderColor: "#E6C65C",
            background: "rgba(212,175,55,0.08)",
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
