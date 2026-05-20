import { BrowserRouter, Route, Routes } from "react-router-dom";

import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import FilmPassed from "./pages/FilmPassed";
import FilmProgrammed from "./pages/FilmProgrammed";
import FilmSuggested from "./pages/FilmSuggested";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="filmPassed" element={<FilmPassed />} />
          <Route path="filmProgrammed" element={<FilmProgrammed />} />
          <Route path="filmSuggested" element={<FilmSuggested />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
