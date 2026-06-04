import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { Box, CircularProgress, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";

import { lightTheme, darkTheme } from "./utils/theme";

import Layout from "./pages/nav_bar";

const Comment = lazy(() => import("./Comment"));
const Backoffice = lazy(() => import("./pages/Backoffice"));
const Concours = lazy(() => import("./pages/Concours"));
const FilmPassed = lazy(() => import("./pages/FilmPassed"));
const FilmProgrammed = lazy(() => import("./pages/FilmProgrammed"));
const FilmSuggested = lazy(() => import("./pages/FilmSuggested"));
const Home = lazy(() => import("./pages/Home"));
const NoPage = lazy(() => import("./pages/NoPage"));
const PageFilm = lazy(() => import("./pages/PageFilm"));

function App() {
  // 1. Détecte si le navigateur de l'utilisateur est configuré en mode sombre
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  
  // 2. Initialise l'état avec la préférence du navigateur
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

  // Synchronise le thème si l'utilisateur change la préférence de son système pendant qu'il navigue
  useEffect(() => {
    setIsDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  // Fonction pour inverser le thème (appelée par la nav bar)
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    // On applique le thème choisi dynamiquement
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      <BrowserRouter>
        <Suspense
          fallback={
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
              <CircularProgress color="secondary" />
            </Box>
          }
        >
        <Routes>
          {/* On passe l'état actuel et la fonction toggle au Layout via le contexte ou des attributs de fenêtre simples */}
          <Route 
            path="/" 
            element={
              <Layout 
                isDarkMode={isDarkMode} 
                toggleTheme={toggleTheme} 
              />
            }
          >
            <Route index element={<Home />} />
            <Route path="filmPassed" element={<FilmPassed />} />
            <Route path="filmProgrammed" element={<FilmProgrammed />} />
            <Route path="filmSuggested" element={<FilmSuggested />} />
            <Route path="Concours" element={<Concours />} />
            <Route path="*" element={<NoPage />} />
            <Route path="backoffice" element={<Backoffice />} />
            <Route path="testComment" element={<Comment />} />
            <Route path="/film/:id" element={<PageFilm />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;