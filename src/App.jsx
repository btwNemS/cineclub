import { BrowserRouter, Route, Routes } from "react-router-dom";

import Backoffice from "./pages/Backoffice";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import FilmPassed from "./pages/FilmPassed";
import FilmProgrammed from "./pages/FilmProgrammed";
import FilmSuggested from "./pages/FilmSuggested";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import NoPage from "./pages/NoPage";

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
          <Route path="backoffice" element={<Backoffice />} />
          <Route path="testPost" element={<Backoffice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
