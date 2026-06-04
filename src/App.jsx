import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";

import { lightTheme, darkTheme } from "./utils/theme";

import Comment from "./Comment";
import Backoffice from "./pages/Backoffice";
import Concours from "./pages/Concours";
import FilmPassed from "./pages/FilmPassed";
import FilmProgrammed from "./pages/FilmProgrammed";
import FilmSuggested from "./pages/FilmSuggested";
import Home from "./pages/Home";
import Layout from "./pages/nav_bar";
import NoPage from "./pages/NoPage";
import PageFilm from "./pages/PageFilm";

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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;