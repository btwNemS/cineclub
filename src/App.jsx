import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";

import theme from "./utils/theme";

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
