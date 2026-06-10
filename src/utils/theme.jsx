// utils/theme.jsx
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
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
    h1: { fontWeight: 700, letterSpacing: "-0.03em", color: "#202349" },
    h2: { fontWeight: 700, color: "#202349" },
    h3: { fontWeight: 600, color: "#202349" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
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
          "&:hover": { background: "#343A73" },
        },
        containedSecondary: {
          background: "#D4AF37",
          color: "#202349",
          "&:hover": { background: "#E6C65C" },
        },
        outlinedPrimary: {
          borderColor: "#202349",
          color: "#202349",
          "&:hover": { background: "rgba(32,35,73,0.04)" },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#111424",
      light: "#343A73",
      dark: "#0B0E1A",
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
      default: "#0B0E1A",
      paper: "#111424",
    },
    text: {
      primary: "#F5F1E8",
      secondary: "#A2A7BD",
    },
    divider: "rgba(212,175,55,0.15)",
  },
  typography: {
    fontFamily: `"Inter", "Roboto", sans-serif`,
    h1: { fontWeight: 700, letterSpacing: "-0.03em", color: "#D4AF37" },
    h2: { fontWeight: 700, color: "#F5F1E8" },
    h3: { fontWeight: 600, color: "#F5F1E8" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    // Surcharge globale pour que la balise native h1 prenne automatiquement la couleur du thème h1
    MuiCssBaseline: {
      styleOverrides: `
        h1, .title {
          font-family: "EB Garamond", serif !important;
          font-weight: 700 !important;
          color: #D4AF37 !important; /* Utilise la couleur or exacte de ta configuration h1 */
          letter-spacing: -0.03em !important;
          font-size: 2.5rem;
          margin-bottom: 24px;
          text-align: center;
        }
      `,
    },
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
        // Depuis MUI v6+, les couleurs par variante (containedPrimary, outlinedPrimary, ...)
        // se pilotent via des variables CSS (--variant-...) plutôt que des clés de styleOverrides dédiées.
        root: {
          variants: [
            {
              props: { variant: "contained", color: "primary" },
              style: {
                "--variant-containedBg": "#343A73",
                "--variant-containedColor": "#FFFFFF",
                "&:hover": {
                  "--variant-containedBg": "#454C8C",
                },
              },
            },
            {
              props: { variant: "outlined", color: "primary" },
              style: {
                "--variant-outlinedBorder": "#F5F1E8",
                "--variant-outlinedColor": "#F5F1E8",
                "&:hover": {
                  "--variant-outlinedBorder": "#F5F1E8",
                  "--variant-outlinedBg": "rgba(245, 241, 232, 0.08)",
                },
              },
            },
          ],
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});