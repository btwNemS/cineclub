import BoutonInscription from "./BoutonInscription";
import ListeInscrits from "./ListeInscrits";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../Authentification";

export default function InscriptionSeance() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const { user } = useAuth();
  console.log(user);
  const theme = useTheme();
  const [isSuscribed, setisSuscribed] = useState(false);
  const [liste, setListe] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [buttonText, setButtonText] = useState("S'inscrire");
  const refreshListe = async () => {
    try {
      const response = await fetch(
        `${API_URL}/registrations/getRegistrationsByFilmId/${id}`,
      );
      const data = await response.json();
      console.log(data);
      setListe(data);

      const pseudoList = data.map((inscrit) => inscrit.pseudo);
      console.log(pseudoList);
      if (pseudoList.includes(user.pseudo)) {
        // setButtonText("Se désinscrire");
        setisSuscribed(true);
      }
      else {
        setisSuscribed(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des inscrits:", error);
    }
  };

  useEffect(() => {
    refreshListe();
  }, []);

  function handleHover() {
    setHovered(true);
  }

  function handleHoverOut() {
    setHovered(false);
  }


  return (
    <div>
      <BoutonInscription
        onMouseEnter={handleHover}

        onMouseLeave={handleHoverOut}
        textButton={buttonText}
        isSuscribed={isSuscribed}
        refreshListe={refreshListe}
        id={id}
        API_URL={API_URL}

      />
      {liste && (
        <ListeInscrits liste={liste}  hovered={hovered} />
      )}
    </div>
  );
}
